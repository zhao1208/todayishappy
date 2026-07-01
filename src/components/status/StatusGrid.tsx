import React from 'react';
import { Grid } from 'antd-mobile';
import StatusCard from './StatusCard';
import type { StatusOption } from '../../types/status';

interface StatusGridProps {
  statuses: StatusOption[];
  onStatusSelect: (statusId: string) => void;
}

const StatusGrid: React.FC<StatusGridProps> = ({ statuses, onStatusSelect }) => {
  return (
    <Grid
      columns={2}
      gap={12}
      style={{
        '--gap': '12px',
      } as React.CSSProperties}
    >
      {statuses.map((status) => (
        <Grid.Item key={status.id}>
          <StatusCard
            status={status}
            selected={false}
            onClick={() => onStatusSelect(status.id)}
          />
        </Grid.Item>
      ))}
    </Grid>
  );
};

export default StatusGrid;
