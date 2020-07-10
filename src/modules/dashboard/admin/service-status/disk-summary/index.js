import React from 'react';
import { connect } from 'react-redux';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import prettySize from 'prettysize';
import { openNewTab } from 'utils';

const DiskSummary = (props) => {
  const { data, caption } = props;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x > cx ? x - 5 : x + 5} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {percent > 0 && `${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const sizeFormatter = (value, name) => {
    return [prettySize(value), name];
  };

  const openSummaryView = () => {
    openNewTab(process.env.REACT_APP_SOLAR_WINDS_SUMMARY_VIEW_URL);
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="tab-pane__group bg-white">
          <p className="tab-pane__title text-bold">
            <span className="cursor-pointer" onClick={openSummaryView}>
              Disk Summary
            </span>
          </p>
          {data.length > 0 && (
            <div className="card p-0">
              <div className="card-body">
                <div className="m-4">
                  <label>
                    <span className="font-weight-bold">Server Name:</span> {caption}
                  </label>
                  <div className="row">
                    {data.map((disk, index) => {
                      const diskData = [
                        {
                          name: 'Used',
                          value: disk?.VolumePercentUsed,
                        },
                        {
                          name: 'Available',
                          value: disk?.VolumePercentAvailable,
                        },
                      ];
                      return (
                        <div key={`metric_${index + 1}`} className="col-md-12 col-lg-4 paddingTop20">
                          <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                              <Tooltip formatter={sizeFormatter} />
                              <Pie data={diskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" labelLine={false} label={renderCustomizedLabel}>
                                {diskData.map((_entry, index) => (
                                  <Cell fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                          <label className="font-weight-bold text-center">{disk?.DeviceId}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (_reducers, ownProp) => ({
  ...ownProp,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DiskSummary);
