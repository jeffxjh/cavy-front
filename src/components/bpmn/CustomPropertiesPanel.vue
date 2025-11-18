<template>
  <div class="custom-properties-panel" v-if="element">
    <div class="panel-header">
      <h3>{{ getElementTypeName() }} 属性</h3>
      <el-button type="text" icon="el-icon-close" @click="$emit('close')"></el-button>
    </div>
    
    <div class="panel-content">
      <el-collapse v-model="activeNames">
        <!-- 基本属性 -->
        <el-collapse-item title="基本属性" name="basic">
          <el-form :model="properties" label-width="80px" size="small">
            <el-form-item label="元素ID">
              <el-input v-model="element.id" disabled />
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="properties.name" @change="updateProperties" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input 
                type="textarea" 
                v-model="properties.documentation" 
                @change="updateProperties"
                :rows="3"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 用户任务属性 -->
        <el-collapse-item v-if="isUserTask" title="用户任务配置" name="userTask">
          <el-form :model="properties" label-width="100px" size="small">
            <el-form-item label="负责人">
              <el-select 
                v-model="properties.assignee" 
                @change="updateProperties"
                filterable
                placeholder="选择用户"
              >
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="候选用户">
              <el-input 
                v-model="properties.candidateUsers" 
                @change="updateProperties"
                placeholder="多个用户用逗号分隔"
              />
            </el-form-item>
            <el-form-item label="候选组">
              <el-input 
                v-model="properties.candidateGroups" 
                @change="updateProperties"
                placeholder="例如: managers"
              />
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="properties.priority" @change="updateProperties">
                <el-option label="最高" value="100" />
                <el-option label="高" value="75" />
                <el-option label="普通" value="50" />
                <el-option label="低" value="25" />
                <el-option label="最低" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="到期时间">
              <el-input 
                v-model="properties.dueDate" 
                @change="updateProperties"
                placeholder="例如: P3D (3天)"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 开始事件属性 -->
        <el-collapse-item v-if="isStartEvent" title="开始事件配置" name="startEvent">
          <el-form :model="properties" label-width="100px" size="small">
            <el-form-item label="发起人">
              <el-input 
                v-model="properties.initiator" 
                @change="updateProperties"
                placeholder="例如: applicant"
              />
            </el-form-item>
            <el-form-item label="表单KEY">
              <el-input 
                v-model="properties.formKey" 
                @change="updateProperties"
                placeholder="表单标识"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 排他网关条件路由配置 -->
        <el-collapse-item v-if="isExclusiveGateway" title="条件路由配置" name="gateway">
          <div class="gateway-config">
            <div v-for="flow in outgoingFlows" :key="flow.id" class="flow-condition">
              <div class="flow-header">
                <span class="flow-label">流向: {{ getTargetName(flow) }}</span>
              </div>
              <el-form-item label="条件表达式">
                <el-input
                  v-model="flowConditions[flow.id]"
                  @change="updateFlowCondition(flow)"
                  placeholder="例如: ${day > 3}"
                />
                <div class="expression-tips">
                  <small>可用变量: applicant, day, amount, approved 等</small>
                </div>
              </el-form-item>
              <el-form-item label="默认流向">
                <el-radio 
                  v-model="defaultFlow" 
                  :label="flow.id"
                  @change="setDefaultFlow(flow)"
                >
                  设为默认流向
                </el-radio>
              </el-form-item>
            </div>
            
            <div v-if="outgoingFlows.length === 0" class="no-flows">
              <el-alert
                title="提示"
                description="请先连接网关到其他节点"
                type="info"
                show-icon
              />
            </div>
          </div>
        </el-collapse-item>

        <!-- 并行网关提示 -->
        <el-collapse-item v-if="isParallelGateway" title="网关配置" name="parallelGateway">
          <el-alert
            title="并行网关"
            description="并行网关不需要条件配置，所有出线会同时执行"
            type="info"
            show-icon
          />
        </el-collapse-item>

        <!-- 包容网关配置 -->
        <el-collapse-item v-if="isInclusiveGateway" title="条件路由配置" name="inclusiveGateway">
          <div class="gateway-config">
            <div v-for="flow in outgoingFlows" :key="flow.id" class="flow-condition">
              <div class="flow-header">
                <span class="flow-label">流向: {{ getTargetName(flow) }}</span>
              </div>
              <el-form-item label="条件表达式">
                <el-input
                  v-model="flowConditions[flow.id]"
                  @change="updateFlowCondition(flow)"
                  placeholder="例如: ${score >= 60}"
                />
                <div class="expression-tips">
                  <small>注意: 包容网关允许多个条件同时满足</small>
                </div>
              </el-form-item>
            </div>
            
            <div v-if="outgoingFlows.length === 0" class="no-flows">
              <el-alert
                title="提示"
                description="请先连接网关到其他节点"
                type="info"
                show-icon
              />
            </div>
          </div>
        </el-collapse-item>

        <!-- 序列流属性 -->
        <el-collapse-item v-if="isSequenceFlow" title="流向配置" name="sequenceFlow">
          <el-form :model="properties" label-width="100px" size="small">
            <el-form-item label="条件表达式">
              <el-input 
                type="textarea"
                v-model="properties.conditionExpression" 
                @change="updateProperties"
                placeholder="例如: ${approved == true}"
                :rows="3"
              />
              <div class="expression-tips">
                <small>条件表达式示例: ${amount > 1000}, ${role == 'manager'}, ${status == 'approved'}</small>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 流程属性 -->
        <el-collapse-item v-if="isProcess" title="流程配置" name="process">
          <el-form :model="properties" label-width="100px" size="small">
            <el-form-item label="流程ID">
              <el-input v-model="properties.id" @change="updateProperties" />
            </el-form-item>
            <el-form-item label="流程名称">
              <el-input v-model="properties.name" @change="updateProperties" />
            </el-form-item>
            <el-form-item label="版本标签">
              <el-input v-model="properties.versionTag" @change="updateProperties" />
            </el-form-item>
            <el-form-item label="是否可执行">
              <el-switch
                v-model="properties.isExecutable"
                @change="updateProperties"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <!-- 服务任务属性 -->
        <el-collapse-item v-if="isServiceTask" title="服务配置" name="serviceTask">
          <el-form :model="properties" label-width="100px" size="small">
            <el-form-item label="实现类型">
              <el-select v-model="properties.implementation" @change="updateProperties">
                <el-option label="Java类" value="##JavaClass" />
                <el-option label="表达式" value="##Expression" />
                <el-option label="代理表达式" value="##DelegateExpression" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="properties.implementation === '##JavaClass'" label="实现类">
              <el-input 
                v-model="properties['flowable:class']" 
                @change="updateProperties"
                placeholder="例如: com.example.MyServiceTask"
              />
            </el-form-item>
            <el-form-item v-if="properties.implementation === '##DelegateExpression'" label="代理表达式">
              <el-input 
                v-model="properties['flowable:delegateExpression']" 
                @change="updateProperties"
                placeholder="例如: ${myDelegateBean}"
              />
            </el-form-item>
            <el-form-item v-if="properties.implementation === '##Expression'" label="执行表达式">
              <el-input 
                v-model="properties['flowable:expression']" 
                @change="updateProperties"
                placeholder="例如: ${myService.execute()}"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  
  <div v-else class="empty-state">
    <el-empty description="请选择流程元素进行配置" />
  </div>
</template>

<script>
export default {
  name: 'CustomPropertiesPanel',
  props: {
    element: Object,
    bpmnModeler: Object
  },
  data() {
    return {
      properties: {},
      activeNames: ['basic'],
      flowConditions: {},
      defaultFlow: '',
      userList: [
        { id: 'zhangsan', name: '张三' },
        { id: 'lisi', name: '李四' },
        { id: 'wangwu', name: '王五' },
        { id: 'zhaoliu', name: '赵六' },
        { id: '${manager}', name: '部门经理' },
        { id: '${director}', name: '总监' }
      ]
    };
  },
  computed: {
    isUserTask() {
      return this.element && this.element.type === 'bpmn:UserTask';
    },
    isStartEvent() {
      return this.element && this.element.type === 'bpmn:StartEvent';
    },
    isEndEvent() {
      return this.element && this.element.type === 'bpmn:EndEvent';
    },
    isSequenceFlow() {
      return this.element && this.element.type === 'bpmn:SequenceFlow';
    },
    isProcess() {
      return this.element && this.element.type === 'bpmn:Process';
    },
    isServiceTask() {
      return this.element && this.element.type === 'bpmn:ServiceTask';
    },
    isExclusiveGateway() {
      return this.element && this.element.type === 'bpmn:ExclusiveGateway';
    },
    isParallelGateway() {
      return this.element && this.element.type === 'bpmn:ParallelGateway';
    },
    isInclusiveGateway() {
      return this.element && this.element.type === 'bpmn:InclusiveGateway';
    },
    outgoingFlows() {
      if (!this.element || !this.element.outgoing) return [];
      return this.element.outgoing;
    }
  },
  watch: {
    element: {
      immediate: true,
      handler(newElement) {
        if (newElement) {
          this.loadProperties();
          // 如果是网关，加载网关特定配置
          if (this.isExclusiveGateway || this.isInclusiveGateway) {
            this.loadGatewayProperties();
          }
        } else {
          this.properties = {};
          this.flowConditions = {};
          this.defaultFlow = '';
        }
      }
    }
  },
  methods: {
    loadProperties() {
      if (!this.element || !this.element.businessObject) {
        this.properties = {};
        return;
      }

      const businessObject = this.element.businessObject;
      
      this.properties = {
        id: businessObject.id || '',
        name: businessObject.name || '',
        documentation: this.getDocumentation(businessObject),
        
        // 用户任务属性
        assignee: businessObject.assignee || '',
        candidateUsers: businessObject.candidateUsers || '',
        candidateGroups: businessObject.candidateGroups || '',
        dueDate: businessObject.dueDate || '',
        priority: businessObject.priority || '50',
        
        // 开始事件属性
        initiator: businessObject.initiator || '',
        formKey: businessObject.formKey || '',
        
        // 序列流属性
        conditionExpression: businessObject.conditionExpression ? 
          businessObject.conditionExpression.body : '',
        
        // 流程属性
        versionTag: businessObject.versionTag || '',
        isExecutable: businessObject.isExecutable !== false,
        
        // 服务任务属性
        implementation: this.getImplementationType(businessObject),
        'flowable:class': businessObject.get ? businessObject.get('flowable:class') || '' : '',
        'flowable:delegateExpression': businessObject.get ? businessObject.get('flowable:delegateExpression') || '' : '',
        'flowable:expression': businessObject.get ? businessObject.get('flowable:expression') || '' : ''
      };
    },

    loadGatewayProperties() {
      if (!this.element) return;
      
      // 加载各流向的条件
      this.outgoingFlows.forEach(flow => {
        const condition = flow.businessObject.conditionExpression;
        this.$set(this.flowConditions, flow.id, 
          condition ? condition.body : ''
        );
      });
      
      // 加载默认流向（仅排他网关）
      if (this.isExclusiveGateway) {
        const defaultFlow = this.element.businessObject.default;
        this.defaultFlow = defaultFlow ? defaultFlow.id : '';
      }
    },

    getDocumentation(businessObject) {
      if (!businessObject.documentation || !businessObject.documentation.length) {
        return '';
      }
      return businessObject.documentation[0].text || '';
    },

    getImplementationType(businessObject) {
      if (!businessObject.get) return '';
      if (businessObject.get('flowable:class')) return '##JavaClass';
      if (businessObject.get('flowable:delegateExpression')) return '##DelegateExpression';
      if (businessObject.get('flowable:expression')) return '##Expression';
      return '';
    },

    updateProperties() {
      if (!this.element || !this.bpmnModeler) return;

      const modeling = this.bpmnModeler.get('modeling');
      const propertiesToUpdate = { ...this.properties };

      try {
        // 处理文档
        if (propertiesToUpdate.documentation) {
          const moddle = this.bpmnModeler.get('moddle');
          propertiesToUpdate.documentation = [
            moddle.create('bpmn:Documentation', {
              text: propertiesToUpdate.documentation
            })
          ];
        }

        // 处理条件表达式
        if (this.isSequenceFlow && propertiesToUpdate.conditionExpression) {
          const moddle = this.bpmnModeler.get('moddle');
          propertiesToUpdate.conditionExpression = moddle.create('bpmn:FormalExpression', {
            body: propertiesToUpdate.conditionExpression
          });
        }

        // 处理服务任务实现类型
        if (this.isServiceTask) {
          propertiesToUpdate['flowable:class'] = '';
          propertiesToUpdate['flowable:delegateExpression'] = '';
          propertiesToUpdate['flowable:expression'] = '';

          switch (propertiesToUpdate.implementation) {
            case '##JavaClass':
              propertiesToUpdate['flowable:class'] = this.properties['flowable:class'];
              break;
            case '##DelegateExpression':
              propertiesToUpdate['flowable:delegateExpression'] = this.properties['flowable:delegateExpression'];
              break;
            case '##Expression':
              propertiesToUpdate['flowable:expression'] = this.properties['flowable:expression'];
              break;
          }
          delete propertiesToUpdate.implementation;
        }

        modeling.updateProperties(this.element, propertiesToUpdate);
        
        this.$message.success('属性更新成功');
        
      } catch (error) {
        console.error('更新属性失败:', error);
        this.$message.error('属性更新失败: ' + error.message);
      }
    },

    // 更新流向条件
    updateFlowCondition(flow) {
      if (!this.bpmnModeler) return;
      
      const modeling = this.bpmnModeler.get('modeling');
      const condition = this.flowConditions[flow.id];
      
      try {
        if (condition && condition.trim()) {
          const moddle = this.bpmnModeler.get('moddle');
          modeling.updateProperties(flow, {
            conditionExpression: moddle.create('bpmn:FormalExpression', {
              body: condition
            })
          });
          this.$message.success('条件表达式已更新');
        } else {
          modeling.updateProperties(flow, {
            conditionExpression: undefined
          });
          this.$message.success('已清除条件表达式');
        }
      } catch (error) {
        console.error('更新条件失败:', error);
        this.$message.error('更新条件失败: ' + error.message);
      }
    },

    // 设置默认流向
    setDefaultFlow(flow) {
      if (!this.bpmnModeler || !this.element) return;
      
      const modeling = this.bpmnModeler.get('modeling');
      modeling.updateProperties(this.element, {
        default: flow
      });
      
      this.$message.success('默认流向已设置');
    },

    // 获取目标节点名称
    getTargetName(flow) {
      const target = flow.target;
      return target.name || target.id || '未知节点';
    },

    getElementTypeName() {
      if (!this.element) return '';
      
      const typeMap = {
        'bpmn:StartEvent': '开始事件',
        'bpmn:EndEvent': '结束事件',
        'bpmn:UserTask': '用户任务',
        'bpmn:ServiceTask': '服务任务',
        'bpmn:ScriptTask': '脚本任务',
        'bpmn:ExclusiveGateway': '排他网关',
        'bpmn:ParallelGateway': '并行网关',
        'bpmn:InclusiveGateway': '包容网关',
        'bpmn:SequenceFlow': '连接线',
        'bpmn:Process': '流程定义'
      };
      
      return typeMap[this.element.type] || this.element.type;
    }
  }
};
</script>

<style scoped>
.custom-properties-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
  background: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 网关配置样式 */
.gateway-config {
  padding: 8px 0;
}

.flow-condition {
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: #f8f9fa;
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.flow-label {
  font-weight: 600;
  color: #409EFF;
}

.expression-tips {
  margin-top: 4px;
}

.expression-tips small {
  color: #909399;
}

.no-flows {
  text-align: center;
  padding: 20px;
  color: #909399;
}

/* 自定义滚动条 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 表单样式优化 */
.el-form-item {
  margin-bottom: 16px;
}

.el-collapse {
  border: none;
}

.el-collapse-item__header {
  font-weight: 600;
  background: #f8f9fa;
  border: none;
}

.el-collapse-item__wrap {
  border: none;
  background: #fff;
}

.el-collapse-item__content {
  padding: 16px 0;
}
</style>