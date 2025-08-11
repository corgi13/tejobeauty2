import { ApiResponse } from '@/types';

const test: ApiResponse<string> = {
  success: true,
  data: 'test',
  message: 'test'
};

console.log(test);