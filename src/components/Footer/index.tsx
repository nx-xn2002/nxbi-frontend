import {DefaultFooter} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {useModel} from "@@/exports";
import {message} from "antd";

const Footer: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const [sseEventSource, setSseEventSource] = useState<EventSource>();
  const defaultMessage = '倪响出品';
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    if (initialState?.currentUser) {
      // 连接到 SSE 流
      const eventSource = new EventSource('http://localhost:8081/api/user/getConn', { withCredentials: true });
      // 监听消息
      eventSource.onmessage = (event) => {
        message.info(event.data);
        // console.log('Received from SSE:', event.data);
      };
      // 监听错误
      eventSource.onerror = (error) => {
        // console.error('SSE Error:', error);
        eventSource.close();
        setSseEventSource(undefined);
      };
      // 保存EventSource实例，以便之后可以关闭它
      setSseEventSource(eventSource);
    }

    // 组件卸载时关闭SSE连接
    return () => {
      if (sseEventSource) {
        sseEventSource.close();
      }
    };
  }, [initialState?.currentUser]); // 依赖项数组中包含initialState.currentUser

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
    />
  );
};
export default Footer;
