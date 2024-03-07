import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProFormDigit, ProTable } from "@ant-design/pro-components";
import { Space } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";
import EditModal from "./editModal";
//资金占用费
const Table8 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
  useEffect(() => {
    if (monthDate) {
      actionRef.current?.reload();
    }
  }, [monthDate]);
  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={[
        {
          title: "序号",
          dataIndex: "id",
        },
        {
          title: "费用局清单名称",
          dataIndex: "feeName",
        },
        {
          title: "费用局清单编码",
          dataIndex: "groupBillCode",
        },
        {
          title: "单位",
          dataIndex: "unit",
        },
        {
          title: "合同收入",
          dataIndex: "sumPrice",
        },
        {
          title: "目标成本",
          dataIndex: "incomeSumPrice",
        },
        {
          title: "往期完成",
          dataIndex: "previousValue",
        },
        {
          title: "本期完成比例",
          dataIndex: "mortgageRatio",
          render: (dom, record) => {
            return (
              <Space>
                {`${dom}%`}
                <EditModal
                  title="本期完成比例"
                  id={record.id}
                  type={2}
                  onSuccess={() => {
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormDigit
                    name={"mortgageRatio"}
                    label={"本期完成比例"}
                    rules={[{ required: true }]}
                    fieldProps={{
                      suffix: "%",
                    }}
                  />
                </EditModal>
              </Space>
            );
          },
        },
        {
          title: "本期完成",
          dataIndex: "mortgageValue",
        },
        {
          title: "累计完成",
          dataIndex: "sumMortgage",
        },
      ]}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!monthDate) return { data: [] };
        const res = await InstallmentApi.getOtherCostList({
          projectId: projectId,
          priceType: 4,
          stageType: tabKey,
          pageNum,
          pageSize,
          monthDate,
          type: 2,
        });
        pageRef.current = { pageSize, pageNum };
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      toolbar={{
        menu: {
          type: "tab",
          activeKey: tabKey,
          items: [
            { label: "地下室阶段", key: "1" },
            { label: "主体", key: "2" },
            { label: "装饰修饰", key: "3" },
          ],
          onChange: (v) => {
            settabKey(v as string);
            actionRef.current?.reset?.();
          },
        },
      }}
    />
  );
};

export default Table8;