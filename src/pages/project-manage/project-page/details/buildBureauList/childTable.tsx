import BuildApi from "@/apis/buildApi";
import {
  ActionType,
  ProColumns,
  ProFormDigit,
  ProTable,
} from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import { useRef, useState } from "react";
import AddModal from "./addModal";
import EditModal from "./editModal";

const ChildTable = ({
  id,
  stageType,
  priceType,
  groupBillCode,
  groupBillUuid,
  parentId,
}: {
  id: number;
  stageType: string;
  priceType: number;
  groupBillCode: string;
  groupBillUuid: string;
  parentId: number;
}) => {
  const actionRef = useRef<ActionType>();
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const columns: ProColumns[] = [
    {
      title: "构件区域",
      dataIndex: "groupBillCode",
    },
    {
      title: "构件名称",
      dataIndex: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "计算项目",
      dataIndex: "computeProject",
    },
    {
      title: "构件工程量",
      dataIndex: "memberNum",
      render(dom, record) {
        return (
          <Space>
            {dom}
            <EditModal
              title="工程量"
              id={record.id}
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            >
              <ProFormDigit
                name={"computerValue"}
                label={"工程量"}
                rules={[{ required: true }]}
              />
            </EditModal>
          </Space>
        );
      },
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        return (
          <Space>
            <Popconfirm
              title="确认删除此数据吗？"
              onConfirm={() => {
                return BuildApi.deleteBill({ ids: [val.id] }).then(() => {
                  actionRef.current?.reload();
                  message.success("操作成功");
                });
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <ProTable
      search={false}
      rowKey={"id"}
      scroll={{ x: "max-content" }}
      bordered
      size="small"
      actionRef={actionRef}
      columns={[...columns]}
      request={async ({ current: pageNum, pageSize }) => {
        const res = await BuildApi.getBureauChildList({
          id: id,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      pagination={{
        defaultPageSize: 10,
      }}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectKeys,
        onChange: (selectedRowKeys) => {
          setSelectKeys(selectedRowKeys as string[]);
        },
      }}
      toolbar={{
        actions: [
          <AddModal
            stageType={stageType}
            priceType={priceType}
            onCreate={() => {
              actionRef.current?.reload();
            }}
            parentId={parentId}
            groupBillCode={groupBillCode}
            groupBillUuid={groupBillUuid}
          />,
        ],
      }}
      tableAlertOptionRender={({ onCleanSelected }) => {
        return (
          <Space size={16}>
            <Popconfirm
              title="确认删除此数据吗？"
              onConfirm={() => {
                return BuildApi.deleteBill({ ids: selectKeys! }).then(() => {
                  actionRef.current?.reload();
                  message.success("删除成功");
                  setSelectKeys(void 0);
                });
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm>
            <Typography.Link onClick={onCleanSelected}>
              取消选择
            </Typography.Link>
          </Space>
        );
      }}
    />
  );
};

export default ChildTable;
