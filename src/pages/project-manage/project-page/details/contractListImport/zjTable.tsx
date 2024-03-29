/**
 * @author Destin
 * @description 合同清单导入-总价措施项目
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Tag, Typography } from "antd";
import { useContext, useEffect, useRef } from "react";
import { ProjectContext } from "..";
import useSelect from "../components/useSelect";
import ImportBtn2 from "./importBtn2";
import MatchModal, { IMatchModalRef } from "./matchModal";

const ZjTable = () => {
  const actionRef = useRef<ActionType>();
  const { selectProject, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 1,
  });
  const { projectId } = useContext(ProjectContext);
  const matchRef = useRef<IMatchModalRef>(null);
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "项目名称",
      dataIndex: "priceName",
    },
    {
      title: "金额(元)",
      dataIndex: "amount",
    },
    {
      title: "匹配的局清单",
      dataIndex: "codeList",
      width: 200,
      render: (_, entity) => {
        return (
          <Space direction="vertical">
            {entity["codeList"]?.map((item: any) => (
              <div
                key={item.groupBillCode}
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
                    ContractImportApi.delZjBureau({
                      groupBillUuid: item.groupBillUuid,
                      id: entity.id,
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
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, entity) => {
        return (
          <Typography.Link
            disabled={entity.children?.length > 0}
            onClick={() => {
              matchRef.current?.show(entity);
            }}
          >
            匹配局清单
          </Typography.Link>
        );
      },
    },
  ];
  useEffect(() => {
    getTypeList();
  }, [getTypeList]);
  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async () => {
          if (!types?.typeId1) return { data: [] };
          const res = await ContractImportApi.getZjList({
            projectId: projectId,
            unitProjectUuid: types.typeId1,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        toolbar={{
          actions: [
            selectProject(() => {
              actionRef.current?.reload();
            }),
            <ImportBtn2
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
        }}
      />
      <MatchModal
        ref={matchRef}
        api={(data) => {
          return ContractImportApi.matchZjBureau(data);
        }}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </>
  );
};

export default ZjTable;
