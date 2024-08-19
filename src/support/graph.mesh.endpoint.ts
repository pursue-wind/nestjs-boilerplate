// @ts-nocheck
//##############################################################################################
// copy from .graphclient/index.ts, support endpoint param
//##############################################################################################
import { type ExecutionResult } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { GraphQLOperation, YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from '@graphql-mesh/cache-localforage';
import { fetch as fetchFn } from '@whatwg-node/fetch';
import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from '@graphql-mesh/graphql';
import AutoPaginationTransform from '@graphprotocol/client-auto-pagination';
import BareMerger from '@graphql-mesh/merger-bare';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import * as importedModule$0 from '../../.graphclient/sources/fusion/introspectionSchema';

const baseDir = pathModule.join(
  typeof __dirname === 'string' ? __dirname : '/',
  '..',
);

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId)
      ? pathModule.relative(baseDir, moduleId)
      : moduleId
  )
    .split('\\')
    .join('/')
    .replace(baseDir + '/', '');
  switch (relativeModuleId) {
    case '.graphclient/sources/fusion/introspectionSchema':
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(
        new Error(`Cannot find module '${relativeModuleId}'.`),
      );
  }
};

const rootStore = new MeshStore(
  '.graphclient',
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: 'ts',
  }),
  {
    readonly: true,
    validate: false,
  },
);

export async function getMeshOptions(ep: string): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child('sources');
  const logger = new DefaultLogger('GraphClient');
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child('cache'),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const fusionTransforms = [];
  const additionalTypeDefs = [] as any[];
  const fusionHandler = new GraphqlHandler({
    name: 'fusion',
    config: { endpoint: ep },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child('fusion'),
    logger: logger.child('fusion'),
    importFn,
  });
  fusionTransforms[0] = new AutoPaginationTransform({
    apiName: 'fusion',
    config: { validateSchema: true, limitOfRecords: 1000 },
    baseDir,
    cache,
    pubsub,
    importFn,
    logger,
  });
  sources[0] = {
    name: 'fusion',
    handler: fusionHandler,
    transforms: fusionTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child('bareMerger'),
    store: rootStore.child('bareMerger'),
  });

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(
  ep: string,
): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: () => getBuiltGraphClientWithEndpoint(ep),
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClientWithEndpoint(
  ep: string = '',
): Promise<MeshInstance> {
  if (meshInstance$ == null && ep === '') {
    console.error('meshInstance$ cannot be initialized.');
  }
  if (meshInstance$ == null || ep !== '') {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions(ep)
          .then((meshOptions) => getMesh(meshOptions))
          .then((newMesh) =>
            meshInstance$.then((oldMesh) => {
              oldMesh.destroy();
              meshInstance$ = Promise.resolve(newMesh);
            }),
          )
          .catch((err) => {
            console.error(
              'Mesh polling failed so the existing version will be used:',
              err,
            );
          });
      }, pollingInterval);
    }
    meshInstance$ = getMeshOptions(ep)
      .then((meshOptions) => getMesh(meshOptions))
      .then((mesh) => {
        const id = mesh.pubsub.subscribe('destroy', () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export type ExecuteMeshFn2<
  TData = any,
  TVariables = any,
  TContext = any,
  TRootValue = any,
> = (
  ep: string,
  document: GraphQLOperation<TData, TVariables>,
  variables: TVariables,
  context?: TContext,
  rootValue?: TRootValue,
  operationName?: string,
) => Promise<ExecutionResult<TData>>;
export type SubscribeMeshFn2<
  TVariables = any,
  TContext = any,
  TRootValue = any,
  TData = any,
> = (
  ep: string,
  document: GraphQLOperation<TData, TVariables>,
  variables?: TVariables,
  context?: TContext,
  rootValue?: TRootValue,
  operationName?: string,
) => Promise<ExecutionResult<TData> | AsyncIterable<ExecutionResult<TData>>>;

export const execute: ExecuteMeshFn2 = (ep, ...args) => {
  return getBuiltGraphClientWithEndpoint(ep).then(({ execute }) =>
    execute(...args),
  );
};
export const subscribe: SubscribeMeshFn2 = (ep, ...args) =>
  getBuiltGraphClientWithEndpoint(ep).then(({ subscribe }) =>
    subscribe(...args),
  );
