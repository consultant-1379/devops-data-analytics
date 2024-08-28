import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';

export interface PipelineIdsDTO{
  pipelineIds: string[];
}

export type JiraDto = {
  jira: string;
  pipelineId: string
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('sample')
  async getWhatever(@Query('timeFilter') timeFilter: string) {
    return this.searchService.getAllUpgradePipelines(timeFilter);
  }

  @Post('apps')
  async getAppsDate(@Body() body: PipelineIdsDTO){

    return this.searchService.getAppsDataByPipelineIds(body.pipelineIds);
    
  }

  @Get('update-jira')
  async updateJira(@Query() jiraDto: JiraDto){
    return this.searchService.updateJiraIds(jiraDto.jira, jiraDto.pipelineId);
  }

  @Get('get-docs')
  async getDocs(@Query('index') index: string){
    return this.searchService.getDocs(index);
  }
}
