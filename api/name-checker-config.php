<?php
/* ==================================================================
   NAME CHECKER: the only file you edit to switch on payments.
   Nothing in here is secret, so it is safe in GitHub.

   In Lemon Squeezy (Store > Products) create ONE product, "Name
   Checker Full Report", with TWO variants:

     1. "30-day pass"   price 9.00 GBP
        Licence keys: ON, activation limit 2, expires after 30 days
     2. "Unlimited"     price 19.00 GBP
        Licence keys: ON, activation limit 3, never expires

   Then fill in the four values marked FILL IN below:
     store_id     Settings > Stores, the number next to your store
     variant ids  Products > the product > each variant, the number
                  in the address bar or the "Variant ID" field
     checkout     each variant's "Share" link (the /buy/... address)

   Leave a value as 0 or '' and the page simply says checkout is
   not set up yet. Nothing breaks.
   ================================================================== */
return [
    'store_id' => 0,                              /* FILL IN */
    'variants' => [
        'pass'     => 0,                          /* FILL IN: 30-day pass variant ID */
        'lifetime' => 0,                          /* FILL IN: unlimited variant ID */
    ],
    'checkout' => [
        'pass'     => '',                         /* FILL IN: https://YOURSTORE.lemonsqueezy.com/buy/... */
        'lifetime' => '',                         /* FILL IN */
    ],
    'price' => [
        'pass'     => '£9',
        'lifetime' => '£19',
    ],

    /* Leave alone. Only changed when testing against a fake server. */
    'api_base' => 'https://api.lemonsqueezy.com',
];
