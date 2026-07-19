/**
 * APiUtils — Reusable API helper class for Playwright tests.
 *
 * Encapsulates two common pre-test API operations:
 *  1. getToken()     — logs in via the auth API and returns a JWT token
 *  2. createOrder()  — uses that token to place an order and returns { token, orderId }
 *
 * Usage: instantiate with a Playwright `apiContext` and a login payload,
 * then call createOrder() in a beforeAll hook to set up test state via API
 * instead of through the UI (faster and more reliable).
 */
class APiUtils {

    /**
     * @param {import('@playwright/test').APIRequestContext} apiContext - Playwright API context
     * @param {{ userEmail: string, userPassword: string }} loginPayLoad - Login credentials
     */
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    /**
     * Authenticates via the login API and returns a JWT token.
     * The token is required as an Authorization header for all subsequent API calls.
     *
     * @returns {Promise<string>} JWT auth token
     */
    async getToken() {
        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            { data: this.loginPayLoad }
        ); // Expects HTTP 200/201

        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        console.log(token);
        return token;
    }

    /**
     * Creates an order via the API and returns both the auth token and the new order ID.
     * This is the primary setup method used in beforeAll hooks — it bypasses the UI checkout
     * flow so tests can focus on order history/validation rather than order creation.
     *
     * @param {{ orders: Array<{ country: string, productOrderedId: string }> }} orderPayLoad
     * @returns {Promise<{ token: string, orderId: string }>}
     */
    async createOrder(orderPayLoad) {
        let response = {};

        // Step 1: Obtain a valid auth token via login
        response.token = await this.getToken();

        // Step 2: Place the order using the token in the Authorization header
        const orderResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayLoad,
                headers: {
                    'Authorization': response.token,
                    'Content-Type': 'application/json'
                }
            }
        );

        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);

        // orders[0] holds the ID of the newly created order
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;

        return response; // { token, orderId }
    }
}

module.exports = { APiUtils };
