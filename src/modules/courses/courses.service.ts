import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterCourseDto, UpdateCourseDto } from './dto';
import { uuid } from 'uuidv4';
import { Course } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}
  async registerCourse(data: RegisterCourseDto) {
    const newCourse = {
      id: uuid(),
      ...data,
    } as Course;
    return await this.prisma.course.create({ data: newCourse });
  }

  async getCourses() {
    return await this.prisma.course.findMany();
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    await this.getCourse(id);
    return await this.prisma.course.update({
      where: {
        id,
      },
      data,
    });
  }

  async getCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) throw new NotFoundException('course');
    return course;
  }

  async deleteCourse(id: string) {
    await this.getCourse(id);
    return await this.prisma.course.delete({
      where: {
        id,
      },
    });
  }
}
