import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/post/post.validation"
import PostService from "@/resources/post/post.service";


class PostController implements Controller{
  public path = "/posts";
  public router = Router();
  private postService = new PostService(); //use dependency injection in future

  constructor(){
    this.initialiseRoutes();
  }
  private initialiseRoutes(): void{
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.create),
      this.create
    )
  }

  private create = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try{
      const {title, body} = req.body;
      const post = await this.postService.create(title, body)
      res.status(201).json({post});
    }
    catch(error){
      next(new HttpException(400, 'Cannot create Post'))
    }
  }


}

export default PostController