export const catchErrorHandler = (res,err)=> {
    return res.status(500).json({error: 'Internal server error!'});
    console.error('!!!', err);
}