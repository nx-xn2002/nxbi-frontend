import {listMyChartByPageUsingPost} from '@/services/nxbi/chartController';
import {useModel} from '@@/exports';
import {Avatar, Card, List, message} from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';
import {whitespace} from "stylis";

const MyChart: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState || {};
  const initSearchParams = {
    current: '1',
    pageSize: '5',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<string>('0');
  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? '0');
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败' + e.message);
    }
  };
  useEffect(() => {
    loadData();
  }, [searchParams]);
  return (
    <div className="my-chart-page">
      <Card title={'我的图表'}>
        <Card title={'搜索图表'}>
          <Search
            placeholder={'请输入图表名称'}
            enterButton
            onSearch={(value) => {
              setSearchParams({
                ...initSearchParams,
                name: value,
              });
            }}
          />
        </Card>

        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page, pageSize) => {
              setSearchParams({
                ...searchParams,
                current: page.toString(),
                pageSize: pageSize.toString(),
              });
            },
            current: parseInt(searchParams.current as string),
            pageSize: parseInt(searchParams.pageSize as string),
            total: parseInt(total),
          }}
          dataSource={chartList}
          renderItem={(item) => (
            <Card>
              <List.Item key={item.id} extra="">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={currentUser ? currentUser.userAvatar : '/images/default_avatar.png'}
                    />
                  }
                  title={item.name}
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: '分析目标：' + item.goal + '<br/>' + '图表类型：' + item.chartType,
                      }}
                    />
                  }

                />
                <div style={{whiteSpace: 'pre-line'}}>{'分析结论：' + item.genResult}</div>
                <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
              </List.Item>
            </Card>
          )}
        />
      </Card>
    </div>
  );
};
export default MyChart;
