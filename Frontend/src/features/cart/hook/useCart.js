import {addItem,getCart} from "../services/cart.api"
import {setCart} from "../state/cart.slice"
import {useDispatch} from "react-redux"


export const useCart = ()=> {

  const dispatch = useDispatch()

      async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })

        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data)
        dispatch(setCart(data.cart))
    }

  return {handleAddItem, handleGetCart}
}





export default useCart