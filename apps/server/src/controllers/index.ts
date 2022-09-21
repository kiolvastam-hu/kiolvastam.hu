import { Router } from "express";
import bookRouter from "./book.controller";
import entryRouter from "./entry.controller";
import tagRouter from "./tag.controller";
import userRouter from "./user.controller";

const router = Router();

router.use('/healthcheck',(req,res)=>{
	res.send({
		status: 'ok'
	});
})
router.use('/users',userRouter);
router.use('/entries',entryRouter);
router.use('/tags',tagRouter);
router.use('/books',bookRouter);

export default router;