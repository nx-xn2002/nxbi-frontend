import {PageContainer} from '@ant-design/pro-components';
import {Card, Collapse, CollapseProps, List} from 'antd';
import React from 'react';

const data = [
  '1.简化导入和分析流程：用户只需将Excel原始数据集导入平台，并输入他们的分析需求，便能自动化生成可视化图表和详尽的分析结论。无需繁琐的手动操作和编写复杂的查询语句，大大提高了数据分析的效率。',
  '2.智能化数据分析：NX智能BI拥有强大的人工智能算法，能够自动识别数据集中的潜在模式和关联规律。它能够智能地进行数据挖掘、聚类分析、预测模型构建等复杂分析任务，让用户能够快速深入洞察数据背后的价值信息。',
  '3.可视化分析洞见：NX智能BI以直观和易读的可视化图表呈现分析结果，帮助用户更好地理解数据的含义和趋势。通过图表、图形和图像的形式，用户可以直观地发现数据中的模式、趋势和异常，从而更准确地做出决策。',
];
const items: CollapseProps['items'] = [
  {
    key: '1',
    label: '步骤一：输入分析目标',
    children: <img src="/images/example1.png"/>,
  },
  {
    key: '2',
    label: '步骤二：上传分析数据',
    children: <img src="/images/example2.png"/>,
  },
  {
    key: '3',
    label: '步骤三：查看结果',
    children: <img src="/images/example3.png" width={'80%'}/>,
  },
];
const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card title="产品介绍" hoverable={true}>
        <List
          size="large"
          header={
            <div>
              <b>NX智能BI</b>是一款创新的智能数据分析平台，它采用了先进的技术和框架，包括Spring
              Boot 和 AIGC，为用户提供了一种高效且智能的数据分析解决方案。相比传统的 BI 工具，NX 智能 BI 具有以下突出特点：
            </div>
          }
          footer={
            <div style={{whiteSpace: 'pre-line'}}>
              总之，NX智能BI通过简化分析流程、智能化分析、可视化分析、个性化定制和高效的数据处理能力，为用户提供了一种高效、智能且可靠的数据分析平台，帮助用户更好地挖掘数据的价值，优化决策过程。
            </div>
          }
          bordered
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        <Collapse items={items} defaultActiveKey={['1', '2', 3]}/>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
