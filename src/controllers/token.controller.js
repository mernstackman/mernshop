import EmailToken from "../database/models"
import CreateEmailToken from "../utils/auth/CreateEmailToken"

class TokenControllers {
    static async storeEmailToken(req, res) {
        try {
            const token = await CreateEmailToken(req.body.data);
            const { user_id } = req.body.data;
            const created_token = await EmailToken.create({ token, user_id });
            return res.status(201).json({
                status: 201,
                success: true,
                error: false,
                created_token,
                message: "Registration success"
            });
        } catch (error) {
            return res.status(400).json({ status: 400, success: false, ...error });
        }
    }
}

export default TokenControllers;
