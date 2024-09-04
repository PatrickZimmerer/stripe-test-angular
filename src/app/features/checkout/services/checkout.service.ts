import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@envs/environment';
import { Product } from '@shared/models/product.interface';
import { loadStripe, RedirectToCheckoutOptions } from '@stripe/stripe-js';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
	private readonly httpClient = inject(HttpClient);
	private readonly API_URL = environment.serverURL;

	onProceedToPay(products: Product[]) {
		console.log('environment.stripeAPIKey: ', environment.stripeAPIKey);
		return this.httpClient
			.post(`${this.API_URL}/checkout`, { items: products })
			.pipe(
				map(async (res: any) => {
					console.log('res: ', res);
					const stripe = await loadStripe(environment.stripeAPIKey);

					// Öffnet einen regulären kaufablauf und setzt settings über die session id
					const checkoutOptionsSessionBased: RedirectToCheckoutOptions = {
						sessionId: res.id,
					};

					const lineItems = products.map((product, i) => {
						if (i === 0) {
							return {
								price: 'price_1PvDdpFPAFvSF3YGT4sOvOmr',
								quantity: product.qty,
							};
						} else
							return {
								price: 'price_1PvFYIFPAFvSF3YGhjcyb7Zs',
								quantity: product.qty,
							};
					});

					// Öffnet einen selbst konfigurierten kaufablauf und setzt settings über das Objekt
					const checkoutOptions: RedirectToCheckoutOptions = {
						successUrl: `${window.location.origin}/success`,
						cancelUrl: `${window.location.origin}/cancel`,
						lineItems: lineItems,
						locale: 'de',
						mode: 'subscription',
					};

					console.log('stripe: ', stripe);
					stripe?.redirectToCheckout(checkoutOptionsSessionBased);
					// stripe?.redirectToCheckout(checkoutOptions);
				})
			)
			.subscribe({
				error: (err) => console.error('Error', err),
			});
	}
}
