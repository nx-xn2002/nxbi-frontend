import {deleteChartUsingPost, listMyChartByPageUsingPost} from '@/services/nxbi/chartController';
import {useModel} from '@@/exports';
import {Avatar, Button, Card, List, message, Popconfirm, PopconfirmProps, Result} from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, {useEffect, useState} from 'react';


const MyChart: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState || {};
  const initSearchParams = {
    current: 1,
    pageSize: 5,
    sortOrder: 'desc',
    sortField: 'createTime',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<string>('0');
  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total?.toString() ?? '0');
        if (res.data.records) {
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          })
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败' + e.message);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const result = await deleteChartUsingPost({id});
      if (result && result.data) {
        if (result.data) {
          await loadData();
          message.success('删除成功');
        }
      }
    } catch (error) {
      message.error('删除时发生错误');
    }
  };
  const cancel: PopconfirmProps['onCancel'] = () => {
    message.info('操作已取消');
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
                current: page,
                pageSize: pageSize,
              });
            },
            current: searchParams.current,
            pageSize: searchParams.pageSize,
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
                <>
                  {
                    item.status === 'succeed' &&
                    <>
                      <div style={{whiteSpace: 'pre-line'}}>{'分析结论：' + item.genResult}</div>
                      <ReactECharts option={JSON.parse(item.genChart ?? '{}')}/>
                      <div style={{fontFamily: "'黑体', simhei, sans-serif", textAlign: 'right'}}>
                        {
                          item.updateTime ? '创建时间：' + new Date(item.updateTime).toLocaleString() : '创建时间：未知'
                        }
                      </div>
                      <Popconfirm
                        title="删除图表"
                        description="您确定要删除该图表吗？此操作不可恢复。"
                        onConfirm={() => (item.id !== undefined ? handleDelete(item.id) : null)}
                        onCancel={cancel}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button danger>删除图表</Button>
                      </Popconfirm>
                    </>
                  }
                  {
                    item.status === 'failed' &&
                    <>
                      <Result
                        status="error"
                        title="图表生成失败"
                        subTitle={item.execMessage}
                      />
                    </>
                  }
                  {
                    item.status === 'wait' &&
                    <>
                      <Result
                        status="warning"
                        title="待生成"
                        subTitle={item.execMessage ?? "当前图表生成队列繁忙，请耐心等待"}
                      />
                    </>
                  }
                  {
                    item.status === 'running' &&
                    <>
                      <Result
                        status="info"
                        title="图表生成中"
                        subTitle={item.execMessage}
                      />
                    </>
                  }
                </>
              </List.Item>
            </Card>
          )}
        />
      </Card>
    </div>
  );
};
export default MyChart;
