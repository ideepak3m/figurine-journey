import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, currency, customerEmail, customerName, orderId, orderNumber, product, brand } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            receipt_email: customerEmail,
            description: `Order #${orderNumber} for ${brand} - ${product}`,
            metadata: {
                orderId,
                orderNumber,
                customerName,
                brand,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            adminOrderId: orderId,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
