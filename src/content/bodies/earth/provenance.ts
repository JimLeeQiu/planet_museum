import raw from './provenance.json';
import type { AssetProvenance } from '../../types';

/** 地球展台全部运行时资产的 provenance 记录（机械校验见 generate:credits）。 */
export const earthProvenance = raw as AssetProvenance[];
