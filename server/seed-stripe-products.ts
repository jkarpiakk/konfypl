import { getUncachableStripeClient } from './stripeClient';

async function seedStripeProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Stripe products for Konfy.pl...');

  const basicProduct = await stripe.products.create({
    name: 'Pakiet Basic',
    description: 'Wyroznienie wydarzenia na 7 dni - idealne na poczatek',
    metadata: {
      tier: 'basic',
      duration_days: '7',
    },
  });

  await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 19900,
    currency: 'pln',
  });

  console.log('Created Basic product:', basicProduct.id);

  const proProduct = await stripe.products.create({
    name: 'Pakiet Pro',
    description: 'Wyroznienie wydarzenia na 14 dni z pozycja TOP',
    metadata: {
      tier: 'pro',
      duration_days: '14',
    },
  });

  await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 49900,
    currency: 'pln',
  });

  console.log('Created Pro product:', proProduct.id);

  const maxProduct = await stripe.products.create({
    name: 'Pakiet Max',
    description: 'Wyroznienie wydarzenia na 30 dni z pelna promocja',
    metadata: {
      tier: 'max',
      duration_days: '30',
    },
  });

  await stripe.prices.create({
    product: maxProduct.id,
    unit_amount: 99900,
    currency: 'pln',
  });

  console.log('Created Max product:', maxProduct.id);
  console.log('All products created successfully!');
}

seedStripeProducts().catch(console.error);
