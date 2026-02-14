
import { authRequired, getBaseUrl } from '../../../utils/request';
import { useUserCartStore } from '../../../zustand/useUserCartStore';

const path = getBaseUrl();

export async function getCart() {
    const { data } = await authRequired.get(`${path}/cart`);
    const { setCartId } = useUserCartStore.getState();

    if (!data?.carts?.productDetails) return [];

    const cart = data.carts;
    setCartId(cart.cartId);

    return cart.productDetails.map((item: any) => ({
        ...item,
    }));
}

export async function addToCart(payload: any) {
    const { data } = await authRequired.post(`${path}/cart/add-to-cart`, {
        ...payload,
    });

    if (data?.data?.cartId) {
        const { setCartId } = useUserCartStore.getState();
        setCartId(data.data.cartId);
    }

    return data;
}

export async function updateCartItem(cartId: string, productId: string, quantity: number) {
    const { data } = await authRequired.patch(`${path}/cart/update-cart/${cartId}`, {
        productId,
        quantity,
    });
    return data;
}

export async function removeCartItem(cartId: string, productId: string) {
    const { data } = await authRequired.delete(`${path}/cart/${cartId}/${productId}`);
    return data;
}

export async function transferGuestCart(guestCart: any[]) {
    if (!guestCart || guestCart.length === 0) return null;

    const { data } = await authRequired.post(`${path}/cart/transfer-cart`, {
        guestCart,
    });

    const cart = data?.data;
    if (!cart?.cartId) return null;

    const { setCartId } = useUserCartStore.getState();
    setCartId(cart.cartId);

    return {
        cartId: cart.cartId,
        items: cart.productDetails,
    };
}
