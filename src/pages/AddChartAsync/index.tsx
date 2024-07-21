import {genChartByAiAsyncUsingPost, genChartByAiUsingPost} from '@/services/nxbi/chartController';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Form, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";

const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>();
  const [form] = useForm();
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const param = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPost(param, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败,' + res.message);
        setSubmitting(false);
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败,' + e.message);
      setSubmitting(false);
    }
  };
  return (
    <div className="add-chart-async">
      <Card title="智能分析（异步提交）" style={{width: "60%"}}>
        <Form
          form={form}
          name="add-chart"
          labelAlign="left"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          onFinish={onFinish}
          style={{maxWidth: 600}}
          initialValues={{
            chartType: '默认(推荐)',
          }}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{required: true, message: '分析目标是必填项！'}]}
          >
            <TextArea placeholder="请输入你的分析需求，如：分析网站用户趋势"/>
          </Form.Item>

          <Form.Item name="name" label="图表名称">
            <TextArea placeholder="请输入图表名称"/>
          </Form.Item>

          <Form.Item name="chartType" label="图表类型">
            <Select
              options={[
                {value: '默认(推荐)', label: null},
                {value: '折线图', label: '折线图'},
                {value: '柱状图', label: '柱状图'},
                {value: '堆叠图', label: '堆叠图'},
                {value: '饼图', label: '饼图'},
                {value: '雷达图', label: '雷达图'},
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="file" label="原始数据" extra="支持文件类型.xlsx">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined/>}>上传文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{span: 20, offset: 4}}>
            <Space>
              <Button type="primary" htmlType="submit">
                开始分析
              </Button>
              <Button htmlType="reset">重新输入</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
