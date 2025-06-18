import { Surfboard } from '../data/surfboards';
import { parseLength } from '../hooks/useSurfboardFilters';

export interface BoardCategory {
  id: string;
  name: string;
  count: number;
}

export const getBoardCategories = (
  allSurfboards: Surfboard[]
): BoardCategory[] => {
  return [
    { id: '', name: 'All Boards', count: allSurfboards.length },
    {
      id: 'longboards',
      name: "Longboards (9'+)",
      count: allSurfboards.filter(board => parseLength(board.length) >= 9)
        .length,
    },
    {
      id: 'midlength',
      name: "Mid-length (7'-9')",
      count: allSurfboards.filter(board => {
        const length = parseLength(board.length);
        return length >= 7 && length < 9;
      }).length,
    },
    {
      id: 'shortboards',
      name: "Shortboards (Under 7')",
      count: allSurfboards.filter(board => parseLength(board.length) < 7)
        .length,
    },
  ];
};
