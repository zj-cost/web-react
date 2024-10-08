import { ContractImportApi } from "@/apis/projectApi";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Tag, Typography } from "antd";
import { useContext, useRef } from "react";
import MatchModal, { IMatchModalRef } from "../components/matchModal";
import { ProjectContext } from "../detailContext";

type IChildTableProp = {
  unitProjectUuid?: string;
  uuid?: string;
  selectKeys?: string[];
  setSelectKeys?: (keys: string[]) => void;
};
const ChildTable = ({
  unitProjectUuid,
  uuid,
  selectKeys,
  setSelectKeys,
}: IChildTableProp) => {
  const matchRef = useRef<IMatchModalRef>(null);
  const actionRef = useRef<ActionType>();
  const { projectInfo } = useContext(ProjectContext);
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    // {
    //   title: "项目特征",
    //   dataIndex: "feature",
    //   render(dom) {
    //     return (
    //       <Typography.Paragraph
    //         style={{ width: 300, margin: 0 }}
    //         ellipsis={{ rows: 2, expandable: true }}
    //       >
    //         {dom}
    //       </Typography.Paragraph>
    //     );
    //   },
    // },
    {
      title: "人工费",
      dataIndex: "showLaborCosts",
    },
    {
      title: "材料费",
      dataIndex: "showMaterialCosts",
    },
    {
      title: "机械费",
      dataIndex: "showMachineryCosts",
    },
    {
      title: "单位",
      dataIndex: "showUnit",
    },
    {
      title: "清单工程量",
      dataIndex: "showNum",
    },
    {
      title: "综合单价",
      dataIndex: "showSubtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },

    {
      title: "匹配的局清单",
      dataIndex: "groupBillDtos",
      width: 200,
      render: (_, entity) => {
        return (
          <Space direction="vertical">
            {entity["groupBillDtos"]?.map((item: any, index: number) => (
              <div
                key={`${item.groupBillCode}${index}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tag color="processing">
                  名称：{item?.groupBillName ?? "-"}
                  <br />
                  编码：{item?.groupBillCode ?? "-"}
                  <br />
                  路径：{item?.groupBillStage ?? "-"}
                </Tag>
                <Typography.Link
                  type="danger"
                  onClick={() => {
                    ContractImportApi.delChildBureau({
                      groupBillUuid: item.groupBillUuid,
                      uuid: entity.uuid,
                      mateId: item.mateId,
                    }).then(() => {
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <DeleteOutlined />
                </Typography.Link>
              </div>
            )) ?? "-"}
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        cardProps={
          {
            // bodyStyle: { padding: 0 },
          }
        }
        size="small"
        actionRef={actionRef}
        columns={[
          ...columns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            render: (_, record) => {
              return (
                <Typography.Link
                  onClick={() => {
                    matchRef.current?.show([record.id]);
                  }}
                  disabled={projectInfo?.confirmStatus === 1}
                >
                  手动匹配
                </Typography.Link>
              );
            },
          },
        ]}
        request={async () => {
          if (!unitProjectUuid) return { data: [], success: true };
          const res = await ContractImportApi.getChildList({
            unitProjectUuid,
            uuid: uuid,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolbar={{
          settings: [],
        }}
        pagination={false}
        rowSelection={
          projectInfo?.confirmStatus === 1
            ? false
            : {
                selectedRowKeys: selectKeys,
                onChange(selectedRowKeys) {
                  setSelectKeys?.(selectedRowKeys as string[]);
                },
              }
        }
        tableAlertRender={false}
      />
      <MatchModal
        ref={matchRef}
        api={(data) => {
          return ContractImportApi.match(data);
        }}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </>
  );
};
export default ChildTable;
