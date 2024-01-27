import useAuth from "@/plugins/auth";

type AuthInstance = ReturnType<typeof useAuth>

const auth: AuthInstance = useAuth()

export default auth;