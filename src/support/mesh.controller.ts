import { Controller, All, Req, Res, Next, Module } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createBuiltMeshHTTPHandler } from './graph.mesh.endpoint';
import { ApiConfigService } from '../config/api-config.service';

@Controller('graphql')
export class GraphqlController {
  private meshHTTP: ReturnType<typeof createBuiltMeshHTTPHandler>;

  constructor(private readonly configService: ApiConfigService) {
    this.meshHTTP = createBuiltMeshHTTPHandler(
      configService.subGraphConfig.fusionSubgraphEndpoint,
    );
  }

  @All('/')
  async handleGraphQL(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.meshHTTP(req, res, next);
  }
}

@Module({
  controllers: [GraphqlController],
})
export class GraphqlModule {}
