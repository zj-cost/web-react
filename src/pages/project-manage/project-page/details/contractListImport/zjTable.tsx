/**
 * @author Destin
 * @description 合同清单导入-总价措施项目
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Tag, Typography } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import MatchModal, { IMatchModalRef } from "../components/matchModal";
import useSelect from "../components/useSelect";
import { ProjectContext } from "../detailContext";
import AddZjModal from "./addZjModal";
import ImportBtn2 from "./importBtn2";

const ZjTable = () => {
  const actionRef = useRef<ActionType>();
  const { selectProject, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 1,
  });
  const { projectId, projectInfo } = useContext(ProjectContext);
  const matchRef = useRef<IMatchModalRef>(null);
  const [selectKeys, setSelectKeys] = useState<string[]>();
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
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        return (
          <Typography.Link
            disabled={
              record.children?.length > 0 || projectInfo?.confirmStatus === 1
            }
            onClick={() => {
              matchRef.current?.show([record.id]);
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
          title: (
            <Space>
              {selectProject(() => {
                actionRef.current?.reload();
              })}
              <ImportBtn2
                unitProjectUuid={types?.typeId1}
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
              <AddZjModal
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
            </Space>
          ),
        }}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange(selectedRowKeys) {
            setSelectKeys(selectedRowKeys as string[]);
          },
        }}
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <Typography.Link
                onClick={() => {
                  if (!selectKeys) return;
                  matchRef.current?.show(selectKeys);
                }}
              >
                批量匹配局清单
              </Typography.Link>
              <Typography.Link onClick={onCleanSelected}>
                取消选择
              </Typography.Link>
            </Space>
          );
        }}
      />
      <MatchModal
        ref={matchRef}
        api={(data) => {
          return ContractImportApi.matchZjBureau(data);
        }}
        onSuccess={() => {
          actionRef.current?.reload?.();
          setSelectKeys(void 0);
        }}
      />
    </>
  );
};

export default ZjTable;
