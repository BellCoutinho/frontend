export interface SpaceInfo {
  space_id: string;
  name: string;
  address: string;
  utility_unit_number: string;
  storage_quota: number;
}

export interface UpdateSpaceRequest {
  name?: string;
  address?: string;
  utility_unit_number?: string;
  storage_quota?: number;
}
