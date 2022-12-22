import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      createdAt: this.formatDate(post.createdAt),
    };
  }

  formatDate(data: Date): string {
    const temp = data.toISOString().split('T')[0];
    const temp2 = temp.split('-');

    return temp2[0].substring(2) + '/' + temp2[1] + '/' + temp2[2];
  }
}
