# Future Enhancements - User Authentication & Cart Persistence

## Phase 5+: Authentication & Advanced Cart Features

### 1. User Authentication (Supabase Auth)
- [ ] Implement sign-in/sign-up with Supabase Auth
- [ ] Social login options (Google, GitHub, etc.)
- [ ] User profile management
- [ ] Protected routes for authenticated users

### 2. Persistent Cart with User Association
**Business Logic:**
- Guest users: Cart stored in localStorage (current implementation)
- Authenticated users: Cart stored in Supabase database linked to user_id
- Cart synchronization: Merge guest cart with user cart on login

**Database Schema Needed:**
```sql
CREATE TABLE user_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    asset_id UUID REFERENCES assets(id),
    custom_order_id UUID REFERENCES custom_orders(id),
    item_type TEXT NOT NULL, -- 'standard' or 'custom'
    quantity INTEGER NOT NULL DEFAULT 1,
    is_reserved BOOLEAN DEFAULT false, -- Item held in cart
    reserved_until TIMESTAMP WITH TIME ZONE, -- Expiry for reservation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Cart Reservation System
**Feature:** "Hold this item for me" checkbox
- [ ] Add checkbox in cart: "Reserve item(s) while I shop"
- [ ] When checked: Mark item as reserved in database
- [ ] Set expiry time (e.g., 30 minutes, 1 hour, or until user purchases)
- [ ] Prevent other users from purchasing reserved items
- [ ] Show "Reserved" badge on product cards for other users
- [ ] Auto-release reservation after expiry
- [ ] Send reminder notification before expiry

**UI Elements:**
```
Cart Page:
[ ] Hold these items for me (30 minutes)
    └─ "Your items will be reserved until [time]"
```

### 4. Real-Time Inventory Alerts
**Feature:** Notify users when someone is viewing/interested in same item

**Implementation:**
- Use Supabase Realtime subscriptions
- Track active viewers per product
- Show notification: "⚡ 2 others are viewing this item"
- Trigger urgency for impulse purchases

**Notifications:**
- "Someone added this to their cart - Act fast!"
- "This item in your cart is being viewed by others"
- "Only 1 left - Complete your purchase now!"

### 5. Smart Cart Management
**Features:**
- [ ] Save items for later (move to wishlist)
- [ ] Price drop alerts for saved items
- [ ] Cart expiry warnings
- [ ] Auto-remove out-of-stock items
- [ ] Suggest similar items if sold out

### 6. Multi-User Scenarios
**Handle conflicts:**
- User A reserves item → User B tries to purchase
  - Show: "This item is temporarily unavailable"
  - Option: "Notify me if it becomes available"
  
- Item reservation expires
  - Email: "Your reserved items are about to expire"
  - Auto-release and notify waiting users

### 7. Database Changes Needed

```sql
-- Track product views/interest
CREATE TABLE product_interest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    user_id UUID REFERENCES auth.users(id), -- Can be null for guests
    session_id TEXT, -- For guest tracking
    interest_type TEXT, -- 'viewing', 'in_cart', 'reserved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservation notifications
CREATE TABLE cart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    notification_type TEXT, -- 'reservation_expiring', 'item_sold', 'price_drop'
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Implementation Priority

**High Priority (Phase 5):**
1. User authentication
2. Persistent cart storage
3. Basic reservation system

**Medium Priority (Phase 6):**
1. Real-time view tracking
2. Reservation notifications
3. Cart expiry system

**Low Priority (Phase 7):**
1. Advanced urgency notifications
2. Wishlist functionality
3. Price drop alerts

---

## Notes for Implementation:

- **Inventory Management:** Since you have unique items (asset_status: 'inventory' or 'sold'), reservations are critical
- **Race Conditions:** Need proper locking when marking items as reserved
- **User Experience:** Balance urgency notifications without being annoying
- **Abandonment:** Track cart abandonment for marketing (optional)

---

## Current Phase 3 Status: ✅ COMPLETE
Ready to proceed with Phase 4: Checkout & Payment (Stripe)
