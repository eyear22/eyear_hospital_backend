import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { PostService } from './post.service';
import { PostDetailParamDto } from './dto/post-detail-param.dto';
import { PostDetailResponse } from './dto/post-detail-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('post')
@ApiTags('Post API')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('detail/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '병원 받은 우편 상세 페이지 확인 API',
    description: '받은 우편 상세 확인',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: PostDetailResponse,
  })
  async getPostDetail(
    @Param() param: PostDetailParamDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!param) {
      return new BadRequestException('required parameter');
    }

    const post = await this.postService.getPostDetail(
      param.postId,
      req.user.hospitalId,
    );
    const result = {
      message: 'success',
      post: post,
    };
    return res.status(HttpStatus.OK).send(result);
  }
}
