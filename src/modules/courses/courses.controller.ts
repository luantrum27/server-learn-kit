import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateCourseDto, RegisterCourseDto } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  @Post('')
  async registerCourse(@Body() data: RegisterCourseDto) {
    return await this.coursesService.registerCourse(data);
  }

  @Put(':id')
  async updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCourseDto,
  ) {
    return await this.coursesService.updateCourse(id, data);
  }

  @Get('')
  async getCourses() {
    return await this.coursesService.getCourses();
  }

  @Get(':id')
  async getCourse(@Param('id', ParseUUIDPipe) id: string) {
    return await this.coursesService.getCourse(id);
  }
  @Delete(':id')
  async deleteCourse(@Param('id', ParseUUIDPipe) id: string) {
    return await this.coursesService.deleteCourse(id);
  }
}
