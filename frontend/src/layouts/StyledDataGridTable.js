import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

export const StyledDataGridTable = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#18a6db', // Grey background for headers
    color: '#fff', // Black text color for headers
    fontSize: '12px', // Smaller font size for compact appearance
    // padding: '2px 5px', // Compact padding for header cells
    borderLeft: '1px solid #d3d3d3'
  },
  '& .MuiDataGrid-cell': {
    // borderRadius: '10px 10px 10px',
    fontSize: '12px', // Smaller font size for cells
    padding: '2px 5px', // Compact padding for cells
    borderBottom: 'none', // Remove border-bottom from cells

  },
  '& .MuiDataGrid-row': {
    boxShadow: '0px 3px #ddd',
    borderTopLeftRadius: '10px', // Border radius for left edge
    borderTopRightRadius: '10px', // Border radius for right edge
    // borderRadius: '0px 10px 10px 10px',
    // padding: '10px 10px 10px',
    maxHeight: '40px !important', // Compact row height
    minHeight: '40px !important', // Compact row height
    border: 'none !importatant'
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none', // Hide the column separator icon for a cleaner look
  },
});
