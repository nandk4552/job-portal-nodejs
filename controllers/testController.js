export const testPostController = async(req,res) => {
    const {name} = req.body;
    res.status(200).send(`Hello ${name}`);
}