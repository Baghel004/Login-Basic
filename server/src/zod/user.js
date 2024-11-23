const zod = require("zod")

const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

function validateUser(data){
    const result = userSchema.safeParse(data);
    return result.success;
}

module.exports = validateUser;