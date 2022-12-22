import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormatDate } from 'src/util/formatDate';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
    this.postRepository = postRepository;
  }

  async getPostDetail(postId: number, hospitalId: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId, hospital: { hospitalId: hospitalId } },
    });

    if (post === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['not existed post'],
        error: 'Not Found',
      });
    }

    return {
      id: post.id,
      video: post.video,
      text: post.text,
      check: post.check,
      stampNumber: post.stampNumber,
      cardNumber: post.cardNumber,
      createdAt: FormatDate.formatDate(post.createdAt),
    };
  }
}
