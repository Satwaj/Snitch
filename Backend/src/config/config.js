import dotenv from "dotenv"


dotenv.config()

const normalizeUrlEnv = (value) => {
    const normalizedValue = value.trim()
    const lastHttpsIndex = normalizedValue.lastIndexOf("https://")

    if (lastHttpsIndex !== -1) {
        return normalizedValue.slice(lastHttpsIndex).trim()
    }

    const lastHttpIndex = normalizedValue.lastIndexOf("http://")

    if (lastHttpIndex !== -1) {
        return normalizedValue.slice(lastHttpIndex).trim()
    }

    return normalizedValue
}


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in the environment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in the environment variables")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in the environment variables")
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in the environment variables")
}

if(!process.env.GOOGLE_REDIRECT_URI){
    throw new Error("GOOGLE_REDIRECT_URI is not defined in the environment variables")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in the environment variables")
}

if(!process.env.RAZORPAY_KEY_ID){
    throw new Error("RAZORPAY_KEY_ID is not defined in the environment variables")
}

if(!process.env.RAZORPAY_KEY_SECRET){
    throw new Error("RAZORPAY_KEY_SECRET is not defined in the environment variables")
}



export const config = {

    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI : normalizeUrlEnv(process.env.GOOGLE_REDIRECT_URI),
    NODE_ENV : process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY : process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET : process.env.RAZORPAY_KEY_SECRET
}

