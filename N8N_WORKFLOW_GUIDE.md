# n8n Email Workflow Guide

## Overview
This guide explains how to set up n8n to handle order confirmation emails for Figurine Journey.

## Architecture

```
React App → Creates Order in Supabase
              ↓
         Sends webhook to n8n (order_id only)
              ↓
         n8n receives trigger
              ↓
         n8n fetches order details from Supabase
              ↓
         n8n fetches order items from Supabase
              ↓
         n8n builds HTML email from template
              ↓
         n8n sends email (Gmail/SendGrid/etc.)
              ↓
         n8n updates Supabase (email_sent = true)
```

## n8n Workflow Setup

### 1. Webhook Trigger Node
- **Type**: Webhook
- **Method**: POST
- **Path**: `/webhook/order-created`
- **Response Mode**: Immediately

**Expected Payload:**
```json
{
  "event": "order.created",
  "order_id": "uuid-here",
  "order_number": "FJ20251112-1234"
}
```

### 2. Supabase Node - Fetch Order
- **Operation**: Get rows
- **Table**: orders
- **Filter**: id = {{ $json.order_id }}

**Returns:**
```json
{
  "id": "uuid",
  "order_number": "FJ20251112-1234",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "416-555-0100",
  "shipping_address": "123 Main St, Toronto, ON M5V 3A8",
  "subtotal": 99.99,
  "shipping_fee": 20.00,
  "tax": 15.60,
  "total": 135.59,
  "payment_status": "paid",
  "order_status": "pending",
  "created_at": "2025-11-12T10:30:00Z"
}
```

### 3. Supabase Node - Fetch Order Items
- **Operation**: Get rows
- **Table**: order_items
- **Filter**: order_id = {{ $json.order_id }}

**Returns:**
```json
[
  {
    "id": "uuid",
    "title": "Goku Super Saiyan Figurine",
    "description": "Limited edition",
    "quantity": 2,
    "price": 49.99,
    "item_type": "standard"
  }
]
```

### 4. Function Node - Build Email HTML

**JavaScript Code:**
```javascript
const order = $('Supabase - Fetch Order').first().json;
const items = $('Supabase - Fetch Order Items').all().map(item => item.json);

// Calculate totals
const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// Build HTML email
const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .order-info { background: #f4f4f4; padding: 15px; margin: 20px 0; }
    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    .total-row { font-weight: bold; font-size: 1.2em; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Order Confirmation</h1>
    </div>
    
    <p>Hi ${order.customer_name},</p>
    <p>Thank you for your order! We're excited to get your figurines to you.</p>
    
    <div class="order-info">
      <strong>Order Number:</strong> ${order.order_number}<br>
      <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}<br>
      <strong>Payment Status:</strong> ${order.payment_status.toUpperCase()}
    </div>
    
    <h2>Order Items</h2>
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>
              <strong>${item.title}</strong>
              ${item.description ? `<br><small>${item.description}</small>` : ''}
            </td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" align="right">Subtotal:</td>
          <td>$${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3" align="right">Shipping:</td>
          <td>$${order.shipping_fee.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3" align="right">Tax:</td>
          <td>$${order.tax.toFixed(2)}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" align="right">Total:</td>
          <td>$${order.total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
    
    <h2>Shipping Address</h2>
    <p>${order.shipping_address}</p>
    
    <div class="footer">
      <p>Questions about your order? Reply to this email or contact us at support@figureit.com</p>
      <p>Thank you for shopping with Figure It!</p>
    </div>
  </div>
</body>
</html>
`;

return {
  to: order.customer_email,
  subject: \`Order Confirmation - \${order.order_number}\`,
  html: emailHTML,
  orderId: order.id
};
```

### 5. Email Node (Gmail/SendGrid)
- **To**: {{ $json.to }}
- **Subject**: {{ $json.subject }}
- **Email Type**: HTML
- **Content**: {{ $json.html }}

### 6. Supabase Node - Update Order
- **Operation**: Update
- **Table**: orders
- **Filter**: id = {{ $json.orderId }}
- **Update Fields**:
  - confirmation_email_sent: true
  - confirmation_email_sent_at: {{ $now }}

### 7. Admin Email (Optional - Branch)
- Duplicate steps 4-5 but send to admin email
- Update admin_email_sent fields instead

## Alternative: Supabase Database Webhooks

Instead of calling n8n from the app, you can use Supabase Database Webhooks:

1. Go to Supabase Dashboard → Database → Webhooks
2. Create new webhook:
   - **Table**: orders
   - **Events**: INSERT
   - **HTTP Request**: POST to your n8n webhook URL
   - **Payload**: `{"order_id": "{{ record.id }}"}`

This way, every new order automatically triggers the email workflow!

## Environment Variables

Add to your `.env.local`:
```bash
VITE_N8N_ORDER_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/order-created
```

## Testing

1. Create a test order in your app
2. Check n8n execution log
3. Verify email was received
4. Check Supabase orders table - `confirmation_email_sent` should be true

## Error Handling

If email sending fails:
- n8n will retry based on workflow settings
- You can manually re-trigger from n8n UI
- Query for unsent emails:
  ```sql
  SELECT * FROM orders 
  WHERE confirmation_email_sent = false 
  ORDER BY created_at DESC;
  ```

## Admin Notification

For admin emails, add another branch in the workflow that sends to your admin email with a different template showing:
- New order alert
- Customer details
- Order summary
- Link to admin dashboard (future)

