<template>
    <div class="custom-properties-panel">
        <div class="panel-header">
            <h3>{{ panelTitle }}</h3>
            <el-button type="text" icon="el-icon-close" @click="$emit('close')"></el-button>
        </div>

        <div class="panel-content">
            <el-collapse v-if="!element"  v-model="activeNames" :accordion="false">
                <!-- 流程基本属性（无元素选中时显示） -->
                <el-collapse-item v-show="!element" title="流程基本属性" name="processBasic">
                    <div class="form-group">
                        <div class="form-item">
                            <label class="form-label">流程ID</label>
                            <el-input v-model="processProperties.id" @change="updateProcessProperties" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">流程名称</label>
                            <el-input v-model="processProperties.name" @change="updateProcessProperties" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">版本标签</label>
                            <el-input v-model="processProperties.versionTag" @change="updateProcessProperties" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">是否可执行</label>
                            <div style="padding: 8px 0;">
                                <el-switch
                                           v-model="processProperties.isExecutable"
                                           @change="updateProcessProperties"
                                           active-text="是"
                                           inactive-text="否" />
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <!-- 自定义属性（无元素选中时显示流程自定义属性） -->
                <el-collapse-item v-if="!element" title="流程自定义属性" name="processCustom">
                    <div class="custom-properties">
                        <div class="custom-props-header">
                            <span>自定义属性</span>
                            <el-button type="text" size="mini" @click="addCustomProperty">
                                <i class="el-icon-plus"></i> 添加属性
                            </el-button>
                        </div>

                        <div v-for="(prop, index) in processCustomProperties" :key="index" class="custom-prop-item">
                            <div class="prop-row">
                                <el-input
                                          v-model="prop.name"
                                          placeholder="属性名"
                                          size="small"
                                          style="width: 120px; margin-right: 8px;"
                                          @change="updateProcessCustomProperties" />
                                <el-input
                                          v-model="prop.value"
                                          placeholder="属性值"
                                          size="small"
                                          style="flex: 1; margin-right: 8px;"
                                          @change="updateProcessCustomProperties" />
                                <el-button
                                           type="text"
                                           size="mini"
                                           icon="el-icon-delete"
                                           @click="removeCustomProperty(index)" />
                            </div>
                        </div>

                        <div v-if="processCustomProperties.length === 0" class="no-custom-props">
                            <el-empty description="暂无自定义属性" :image-size="60" />
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
             <el-collapse 
                v-else 
                v-model="activeNames" 
                class="no-transition-collapse">
                 <!-- 元素基本属性（有元素选中时显示） -->
                <el-collapse-item v-if="element" title="基本属性" name="basic">
                    <div class="form-group">
                        <div class="form-item">
                            <label class="form-label">元素ID</label>
                            <el-input :value="element.id" disabled />
                        </div>
                        <div class="form-item">
                            <label class="form-label">名称</label>
                            <el-input v-model="properties.name" @change="updateProperties" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">描述</label>
                            <el-input
                                      type="textarea"
                                      v-model="properties.documentation"
                                      @change="updateProperties"
                                      :rows="3" />
                        </div>
                    </div>
                </el-collapse-item>

                <!-- 元素自定义属性（有元素选中时显示） -->
                <el-collapse-item v-if="element" title="自定义属性" name="elementCustom">
                    <div class="custom-properties">
                        <div class="custom-props-header">
                            <span>自定义属性</span>
                            <el-button type="text" size="mini" @click="addElementCustomProperty">
                                <i class="el-icon-plus"></i> 添加属性
                            </el-button>
                        </div>

                        <div v-for="(prop, index) in elementCustomProperties" :key="index" class="custom-prop-item">
                            <div class="prop-row">
                                <el-input
                                          v-model="prop.name"
                                          placeholder="属性名"
                                          size="small"
                                          style="width: 120px; margin-right: 8px;"
                                          @change="updateElementCustomProperties" />
                                <el-input
                                          v-model="prop.value"
                                          placeholder="属性值"
                                          size="small"
                                          style="flex: 1; margin-right: 8px;"
                                          @change="updateElementCustomProperties" />
                                <el-button
                                           type="text"
                                           size="mini"
                                           icon="el-icon-delete"
                                           @click="removeElementCustomProperty(index)" />
                            </div>
                        </div>

                        <div v-if="elementCustomProperties.length === 0" class="no-custom-props">
                            <el-empty description="暂无自定义属性" :image-size="60" />
                        </div>
                    </div>
                </el-collapse-item>

                <!-- 用户任务属性 -->
                <el-collapse-item v-if="isUserTask" title="用户任务配置" name="userTask">
                    <div class="form-group">
                        <div class="form-item">
                            <label class="form-label">负责人</label>
                            <el-select
                                       v-model="properties.assignee"
                                       @change="updateProperties"
                                       filterable
                                       placeholder="选择用户"
                                       style="width: 100%">
                                <el-option
                                           v-for="user in userList"
                                           :key="user.id"
                                           :label="user.name"
                                           :value="user.id" />
                            </el-select>
                        </div>
                        <div class="form-item">
                            <label class="form-label">候选用户</label>
                            <el-input
                                      v-model="properties.candidateUsers"
                                      @change="updateProperties"
                                      placeholder="多个用户用逗号分隔" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">候选组</label>
                            <el-input
                                      v-model="properties.candidateGroups"
                                      @change="updateProperties"
                                      placeholder="例如: managers" />
                        </div>
                        <div class="form-item">
                            <label class="form-label">优先级</label>
                            <el-select v-model="properties.priority" @change="updateProperties" style="width: 100%">
                                <el-option label="最高" value="100" />
                                <el-option label="高" value="75" />
                                <el-option label="普通" value="50" />
                                <el-option label="低" value="25" />
                                <el-option label="最低" value="0" />
                            </el-select>
                        </div>
                        <div class="form-item">
                            <label class="form-label">到期时间</label>
                            <el-input
                                      v-model="properties.dueDate"
                                      @change="updateProperties"
                                      placeholder="例如: P3D (3天)" />
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomPropertiesPanel',
    props: {
        element: Object,
        bpmnModeler: Object,
        processElement: Object // 新增：流程元素
    },
    data() {
        return {
            properties: {},
            processProperties: {
                id: '',
                name: '',
                versionTag: '',
                isExecutable: true
            },
            activeNames: ['basic', 'processBasic'],
            // activeNames: ['basic', 'processBasic','elementCustom','processCustom','userTask'],
            flowConditions: {},
            flowNames: {},
            defaultFlow: '',
            // 流程自定义属性
            processCustomProperties: [],
            // 元素自定义属性
            elementCustomProperties: [],
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
        panelTitle() {
            if (this.element) {
                return `${this.getElementTypeName()} 属性`;
            } else {
                return '流程属性';
            }
        },
        // 其他计算属性保持不变
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
        outgoingSequenceFlows() {
            if (!this.element || !this.element.outgoing) return [];
            return this.element.outgoing.filter(flow =>
                flow.type === 'bpmn:SequenceFlow'
            );
        },
        outgoingFlows() {
            if (!this.element || !this.element.outgoing) return [];
            return this.element.outgoing;
        }
    },
    watch: {
        element: {
            immediate: true,
            handler(newElement, oldElement) {
                // 元素切换时重置激活状态
                if (newElement !== oldElement) {
                    this.$nextTick(() => {
                        this.resetActiveNames();
                    });
                }
                if (newElement) {
                    this.loadProperties();
                    this.loadElementCustomProperties();
                    if (this.isExclusiveGateway || this.isInclusiveGateway) {
                        this.loadGatewayProperties();
                    }
                } else {
                    this.properties = {};
                    this.flowConditions = {};
                    this.flowNames = {};
                    this.defaultFlow = '';
                    this.elementCustomProperties = [];
                }
            }
        },
        processElement: {
            immediate: true,
            handler(newProcessElement) {
                if (newProcessElement) {
                    this.loadProcessProperties();
                    this.loadProcessCustomProperties();
                }
            }
        }
    },
    methods: {
        resetActiveNames() {
            // 根据当前选中元素类型设置合适的默认展开项
            // if (this.element) {
            // this.activeNames = ['basic', 'elementCustom'];
            // 根据元素类型添加对应的配置项
            // if (this.isUserTask) this.activeNames.push('userTask');
            // if (this.isServiceTask) this.activeNames.push('serviceTask');
            // if (this.isExclusiveGateway) this.activeNames.push('gateway');
            // } else {
            //     this.activeNames = ['processBasic', 'processCustom'];
            // }
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
        // 加载流程属性
        loadProcessProperties() {
            if (!this.processElement || !this.processElement.businessObject) {
                this.processProperties = {
                    id: '',
                    name: '',
                    versionTag: '',
                    isExecutable: true
                };
                return;
            }

            const businessObject = this.processElement.businessObject;
            this.processProperties = {
                id: businessObject.id || '',
                name: businessObject.name || '',
                versionTag: businessObject.versionTag || '',
                isExecutable: businessObject.isExecutable !== false
            };
        },

        // 更新流程属性
        updateProcessProperties() {
            if (!this.processElement || !this.bpmnModeler) return;

            const modeling = this.bpmnModeler.get('modeling');
            try {
                modeling.updateProperties(this.processElement, this.processProperties);
                this.$message.success('流程属性更新成功');
            } catch (error) {
                console.error('更新流程属性失败:', error);
                this.$message.error('更新流程属性失败: ' + error.message);
            }
        },

        // 加载流程自定义属性
        loadProcessCustomProperties() {
            if (!this.processElement || !this.processElement.businessObject) {
                this.processCustomProperties = [];
                return;
            }

            const businessObject = this.processElement.businessObject;
            const extensionElements = businessObject.extensionElements;

            this.processCustomProperties = this.parseCustomProperties(extensionElements);
        },

        // 更新流程自定义属性
        updateProcessCustomProperties() {
            if (!this.processElement || !this.bpmnModeler) return;

            const modeling = this.bpmnModeler.get('modeling');
            const moddle = this.bpmnModeler.get('moddle');

            try {
                const extensionElements = this.createExtensionElements(
                    this.processCustomProperties,
                    moddle
                );

                modeling.updateProperties(this.processElement, {
                    extensionElements: extensionElements
                });

                this.$message.success('流程自定义属性更新成功');
            } catch (error) {
                console.error('更新流程自定义属性失败:', error);
                this.$message.error('更新流程自定义属性失败: ' + error.message);
            }
        },

        // 添加流程自定义属性
        addCustomProperty() {
            this.processCustomProperties.push({
                name: '',
                value: ''
            });
        },

        // 删除流程自定义属性
        removeCustomProperty(index) {
            this.processCustomProperties.splice(index, 1);
            this.updateProcessCustomProperties();
        },

        // 加载元素自定义属性
        loadElementCustomProperties() {
            if (!this.element || !this.element.businessObject) {
                this.elementCustomProperties = [];
                return;
            }

            const businessObject = this.element.businessObject;
            const extensionElements = businessObject.extensionElements;

            this.elementCustomProperties = this.parseCustomProperties(extensionElements);
        },

        // 更新元素自定义属性
        updateElementCustomProperties() {
            if (!this.element || !this.bpmnModeler) return;

            const modeling = this.bpmnModeler.get('modeling');
            const moddle = this.bpmnModeler.get('moddle');

            try {
                const extensionElements = this.createExtensionElements(
                    this.elementCustomProperties,
                    moddle
                );

                modeling.updateProperties(this.element, {
                    extensionElements: extensionElements
                });

                this.$message.success('元素自定义属性更新成功');
            } catch (error) {
                console.error('更新元素自定义属性失败:', error);
                this.$message.error('更新元素自定义属性失败: ' + error.message);
            }
        },

        // 添加元素自定义属性
        addElementCustomProperty() {
            this.elementCustomProperties.push({
                name: '',
                value: ''
            });
        },

        // 删除元素自定义属性
        removeElementCustomProperty(index) {
            this.elementCustomProperties.splice(index, 1);
            this.updateElementCustomProperties();
        },

        // 解析自定义属性
        parseCustomProperties(extensionElements) {
            if (!extensionElements || !extensionElements.values) {
                return [];
            }

            const properties = [];
            extensionElements.values.forEach(value => {
                // 检查 camunda:Properties
                if (value.$type === 'camunda:Properties') {
                    value.values.forEach(prop => {
                        if (prop.$type === 'camunda:Property') {
                            properties.push({
                                name: prop.name || '',
                                value: prop.value || ''
                            });
                        }
                    });
                }
                // 也可以检查其他命名空间的属性
                if (value.$type === 'flowable:Properties') {
                    value.values.forEach(prop => {
                        if (prop.$type === 'flowable:Property') {
                            properties.push({
                                name: prop.name || '',
                                value: prop.value || ''
                            });
                        }
                    });
                }
            });

            return properties;
        },

        // 创建扩展元素
        createExtensionProperties(customProperties, moddle) {
            if (!customProperties || customProperties.length === 0) {
                return null;
            }

            const properties = customProperties
                .filter(prop => prop.name && prop.value)
                .map(prop => moddle.create('camunda:Property', { // 使用 camunda:Property
                    name: prop.name,
                    value: prop.value
                }));

            if (properties.length === 0) {
                return null;
            }

            return moddle.create('camunda:Properties', { // 使用 camunda:Properties
                values: properties
            });
        },

        // 创建扩展元素
        createExtensionElements(customProperties, moddle) {
            const propertiesElement = this.createExtensionProperties(customProperties, moddle);

            if (!propertiesElement) {
                return null;
            }

            return moddle.create('bpmn:ExtensionElements', {
                values: [propertiesElement]
            });
        },

        // 其他方法保持不变
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
                assignee: businessObject.assignee || '',
                candidateUsers: businessObject.candidateUsers || '',
                candidateGroups: businessObject.candidateGroups || '',
                dueDate: businessObject.dueDate || '',
                priority: businessObject.priority || '50',
                initiator: businessObject.initiator || '',
                formKey: businessObject.formKey || '',
                versionTag: businessObject.versionTag || '',
                isExecutable: businessObject.isExecutable !== false,
                implementation: this.getImplementationType(businessObject),
                'flowable:class': businessObject.get ? businessObject.get('flowable:class') || '' : '',
                'flowable:delegateExpression': businessObject.get ? businessObject.get('flowable:delegateExpression') || '' : '',
                'flowable:expression': businessObject.get ? businessObject.get('flowable:expression') || '' : ''
            };
        },

        // 其他方法保持不变...
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
                if (propertiesToUpdate.documentation) {
                    const moddle = this.bpmnModeler.get('moddle');
                    propertiesToUpdate.documentation = [
                        moddle.create('bpmn:Documentation', {
                            text: propertiesToUpdate.documentation
                        })
                    ];
                }

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
                this.$message.error('更新属性失败: ' + error.message);
            }
        },

        getElementTypeName() {
            if (!this.element) return '流程';

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

/* 自定义属性样式 */
.custom-properties {
    padding: 8px 0;
}

.custom-props-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e6e6e6;
}

.custom-props-header span {
    font-weight: 600;
    color: #303133;
}

.prop-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
}

.no-custom-props {
    text-align: center;
    padding: 20px;
    color: #909399;
}

/* 其他样式保持不变 */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

/* 滚动条 */
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

/* 折叠面板 */
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

/* 完全禁用折叠动画 */
.no-transition-collapse ::v-deep .el-collapse-item__wrap {
    transition: none !important;
    -webkit-transition: none !important;
    will-change: unset !important;
}

.no-transition-collapse ::v-deep .el-collapse-item__content {
    transition: none !important;
    -webkit-transition: none !important;
    animation: none !important;
    -webkit-animation: none !important;
    padding-bottom: 0 !important;
}

.no-transition-collapse ::v-deep .el-collapse-item__header {
    transition: none !important;
    -webkit-transition: none !important;
}

/* 禁用所有过渡效果 */
.no-transition-collapse ::v-deep * {
    transition: none !important;
    -webkit-transition: none !important;
    animation: none !important;
    -webkit-animation: none !important;
}
</style>