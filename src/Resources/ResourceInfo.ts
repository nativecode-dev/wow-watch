import { ResourceVersion } from './ResourceVersion'

export interface ResourceInfo {
  alpha?: ResourceVersion
  beta?: ResourceVersion
  latest: ResourceVersion
  preview?: ResourceVersion
}
