<template>
    <div class="model">
        <div class="header">
            <h1>BPMN流程配置器</h1>
            <div class="header-actions">
                <el-upload
                    action=""
                    :show-file-list="false"
                    :before-upload="handleBpmnUpload"
                    accept=".bpmn,.xml"
                >
                    <el-button type="primary">导入BPMN文件</el-button>
                </el-upload>
                <el-button type="primary" @click="exportConfig">导出配置</el-button>
            </div>
        </div>

        <div class="content">
            <!-- 左侧流程画布 -->
            <div class="canvas-container">
                <h3>流程画布</h3>
                <p class="step-tip">点击节点进行配置，可拖动节点位置</p>

                <div
                    class="process-canvas"
                    ref="canvas"
                    @mousemove="handleCanvasDrag"
                    @mouseup="stopDrag"
                    @mouseleave="stopDrag"
                >
                    <!-- 流程节点 -->
                    <div
                        v-for="node in bpmnNodes"
                        :key="node.id"
                        :class="[
                            'process-node',
                            'node-' + node.type,
                            {
                                'node-active': selectedNode && selectedNode.id === node.id,
                                'node-configured': getNodeStatus(node),
                            },
                        ]"
                        :style="{
                            left: node.x + 'px',
                            top: node.y + 'px',
                        }"
                        @mousedown="startDrag(node, $event)"
                        @click="selectNode(node)"
                    >
                        <div class="node-icon">
                            <i :class="getNodeIcon(node.type)"></i>
                        </div>
                        <div class="node-content">
                            <div class="node-title">{{ node.name }}</div>
                            <div class="node-id">{{ node.id }}</div>
                        </div>
                        <div v-if="getNodeStatus(node)" class="node-status">
                            <i class="el-icon-check"></i>
                        </div>
                    </div>

                    <!-- 连接线 -->
                    <svg
                        class="connection-layer"
                        :width="canvasSize.width"
                        :height="canvasSize.height"
                    >
                        <defs>
                            <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon points="0 0, 10 3.5, 0 7" fill="#409EFF" />
                            </marker>
                            <marker
                                id="arrowhead-configured"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon points="0 0, 10 3.5, 0 7" fill="#67C23A" />
                            </marker>
                        </defs>

                        <g v-for="connection in connections" :key="connection.id">
                            <!-- 主线 -->
                            <path
                                :d="connection.path"
                                :class="[
                                    'connection-line',
                                    { 'connection-configured': connection.configured },
                                ]"
                                :marker-end="
                                    connection.configured
                                        ? 'url(#arrowhead-configured)'
                                        : 'url(#arrowhead)'
                                "
                            />

                            <!-- 分支条件文字 -->
                            <text
                                v-if="connection.condition"
                                :x="connection.textX"
                                :y="connection.textY"
                                class="connection-label"
                                text-anchor="middle"
                            >
                                {{ connection.condition }}
                            </text>
                        </g>
                    </svg>
                </div>
            </div>

            <!-- 右侧配置容器 -->
            <div class="config-container">
                <h3>节点配置</h3>

                <div v-if="selectedNode">
                    <div class="config-form">
                        <el-form :model="currentConfig" label-width="100px">
                            <el-form-item label="节点ID">
                                <el-input v-model="selectedNode.id" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="节点名称">
                                <el-input
                                    v-model="selectedNode.name"
                                    @change="updateNodeName"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="节点类型">
                                <el-tag :type="getNodeTypeTag(selectedNode.type)">
                                    {{ getNodeTypeText(selectedNode.type) }}
                                </el-tag>
                            </el-form-item>

                            <template
                                v-if="selectedNode.type !== 'start' && selectedNode.type !== 'end'"
                            >
                                <el-form-item label="角色">
                                    <el-select
                                        v-model="currentConfig.role"
                                        placeholder="请选择角色"
                                    >
                                        <el-option label="管理员" value="manage"></el-option>
                                        <el-option label="审核员" value="review"></el-option>
                                        <el-option label="操作员" value="operate"></el-option>
                                        <el-option label="查看者" value="view"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="权限">
                                    <el-checkbox-group v-model="currentConfig.permissions">
                                        <el-checkbox label="read">读取</el-checkbox>
                                        <el-checkbox label="write">写入</el-checkbox>
                                        <el-checkbox label="delete">删除</el-checkbox>
                                        <el-checkbox label="approve">审批</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item label="备注">
                                    <el-input
                                        type="textarea"
                                        v-model="currentConfig.remark"
                                        placeholder="请输入备注信息"
                                        :rows="2"
                                    ></el-input>
                                </el-form-item>
                            </template>

                            <el-form-item v-if="selectedNode.type === 'gateway'">
                                <el-button type="success" @click="showGatewayConfig">
                                    配置分支
                                </el-button>
                            </el-form-item>

                            <el-form-item
                                v-if="selectedNode.type !== 'start' && selectedNode.type !== 'end'"
                            >
                                <el-button type="primary" @click="saveConfig">保存配置</el-button>
                                <el-button @click="clearConfig">清除配置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div v-else>
                    <p class="no-selection-tip">请选择一个节点进行配置</p>
                </div>

                <h3 class="config-table-title">配置表</h3>
                <div class="table-wrapper">
                    <table class="config-table" v-if="configTable.length > 0">
                        <thead>
                            <tr>
                                <th>节点ID</th>
                                <th>节点类型</th>
                                <th>角色</th>
                                <th>权限</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="config in configTable" :key="config.nodeId">
                                <td>{{ config.nodeId }}</td>
                                <td>
                                    <el-tag
                                        :type="getNodeTypeTag(getNodeType(config.nodeId))"
                                        size="small"
                                    >
                                        {{ getNodeTypeText(getNodeType(config.nodeId)) }}
                                    </el-tag>
                                </td>
                                <td>{{ config.role }}</td>
                                <td>{{ config.permissions.join(', ') }}</td>
                                <td>{{ config.remark }}</td>
                                <td>
                                    <el-button type="text" @click="editConfig(config)">
                                        编辑
                                    </el-button>
                                    <el-button
                                        type="text"
                                        class="delete-btn"
                                        @click="deleteConfig(config.nodeId)"
                                    >
                                        删除
                                    </el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="empty-config">
                        暂无配置数据
                    </div>
                </div>
            </div>
        </div>

        <!-- 网关分支配置弹窗 -->
        <el-dialog title="网关分支配置" :visible.sync="gatewayDialogVisible" width="700px">
            <div class="gateway-config">
                <h4>网关节点: {{ selectedGateway ? selectedGateway.name : '' }}</h4>
                <p>节点ID: {{ selectedGateway ? selectedGateway.id : '' }}</p>

                <el-table :data="gatewayBranches" style="width: 100%">
                    <el-table-column prop="id" label="分支ID" width="80"></el-table-column>
                    <el-table-column prop="name" label="分支名称" width="120"></el-table-column>
                    <el-table-column prop="condition" label="条件表达式">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.condition" size="small"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="target" label="目标节点" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.target" size="small">
                                <el-option
                                    v-for="node in targetNodes"
                                    :key="node.id"
                                    :label="node.name"
                                    :value="node.id"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="removeBranch(scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="margin-top: 16px;">
                    <el-button type="primary" size="small" @click="addBranch">添加分支</el-button>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="gatewayDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveGatewayConfig">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ModelConfig',
    data() {
        return {
            selectedNode: null,
            selectedGateway: null,
            currentConfig: {
                role: '',
                permissions: [],
                remark: '',
            },
            gatewayDialogVisible: false,
            isDragging: false,
            dragNode: null,
            startX: 0,
            startY: 0,
            lastDragTime: 0,
            dragThrottle: 16, // 60fps

            bpmnNodes: [
                { id: 'N0001', name: '开始', type: 'start', x: 50, y: 150 },
                { id: 'N0002', name: '提交申请', type: 'task', x: 200, y: 150 },
                { id: 'N0003', name: '审批网关', type: 'gateway', x: 350, y: 150 },
                { id: 'N0004', name: '初审', type: 'task', x: 500, y: 80 },
                { id: 'N0005', name: '复审', type: 'task', x: 500, y: 150 },
                { id: 'N0006', name: '特殊处理', type: 'task', x: 500, y: 220 },
                { id: 'N0007', name: '结束', type: 'end', x: 650, y: 150 },
            ],

            connections: [
                { id: 'c1', source: 'N0001', target: 'N0002', configured: false },
                { id: 'c2', source: 'N0002', target: 'N0003', configured: false },
                {
                    id: 'c3',
                    source: 'N0003',
                    target: 'N0004',
                    configured: false,
                    condition: '金额≤1000',
                },
                {
                    id: 'c4',
                    source: 'N0003',
                    target: 'N0005',
                    configured: false,
                    condition: '1000<金额≤5000',
                },
                {
                    id: 'c5',
                    source: 'N0003',
                    target: 'N0006',
                    configured: false,
                    condition: '金额>5000',
                },
                { id: 'c6', source: 'N0004', target: 'N0007', configured: false },
                { id: 'c7', source: 'N0005', target: 'N0007', configured: false },
                { id: 'c8', source: 'N0006', target: 'N0007', configured: false },
            ],

            gatewayBranches: [
                { id: 'b1', name: '小额审批', condition: 'amount <= 1000', target: 'N0004' },
                {
                    id: 'b2',
                    name: '中额审批',
                    condition: 'amount > 1000 && amount <= 5000',
                    target: 'N0005',
                },
                { id: 'b3', name: '大额审批', condition: 'amount > 5000', target: 'N0006' },
            ],

            configTable: [],
        };
    },

    computed: {
        targetNodes() {
            if (!this.selectedGateway) return [];
            return this.bpmnNodes.filter(
                (node) => node.id !== this.selectedGateway.id && node.type !== 'start',
            );
        },

        // 动态计算画布大小
        canvasSize() {
            if (this.$refs.canvas) {
                const rect = this.$refs.canvas.getBoundingClientRect();
                return {
                    width: rect.width,
                    height: rect.height,
                };
            }
            return { width: 1000, height: 500 };
        },
    },

    mounted() {
        // 确保初始连接线计算
        this.$nextTick(() => {
            this.calculateConnections();
        });

        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        // 窗口大小变化处理
        handleResize() {
            this.$nextTick(() => {
                this.calculateConnections();
            });
        },

        // BPMN文件导入
        handleBpmnUpload(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        this.parseBpmnFile(e.target.result);
                        this.$message.success('BPMN文件导入成功');
                        resolve();
                    } catch (error) {
                        this.$message.error('BPMN文件解析失败');
                        reject(error);
                    }
                };
                reader.onerror = () => {
                    this.$message.error('文件读取失败');
                    reject();
                };
                reader.readAsText(file);
            });
        },

        // 解析BPMN文件
        parseBpmnFile(xmlContent) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

            // 清空现有数据
            this.bpmnNodes = [];
            this.connections = [];
            this.selectedNode = null;

            // 解析流程节点
            const process = xmlDoc.getElementsByTagName('process')[0];
            if (!process) return;

            let nodeCounter = 0;
            const baseX = 50;
            const baseY = 150;
            const horizontalSpacing = 150;
            const verticalSpacing = 100;

            // 节点类型映射
            const nodeTypeMap = {
                // 事件类型
                startEvent: 'start',
                endEvent: 'end',
                terminateEvent: 'end',
                errorEvent: 'event',
                messageEvent: 'event',
                timerEvent: 'event',
                escalationEvent: 'event',
                conditionalEvent: 'event',
                signalEvent: 'event',

                // 任务类型
                userTask: 'task',
                serviceTask: 'task',
                scriptTask: 'task',
                businessRuleTask: 'task',
                sendTask: 'task',
                receiveTask: 'task',
                manualTask: 'task',
                callActivity: 'subprocess',

                // 网关类型
                exclusiveGateway: 'gateway',
                parallelGateway: 'gateway',
                inclusiveGateway: 'gateway',
                eventBasedGateway: 'gateway',
                complexGateway: 'gateway',

                // 子流程
                subProcess: 'subprocess',
                adHocSubProcess: 'subprocess',
                transaction: 'subprocess',

                // 其他元素
                intermediateCatchEvent: 'event',
                intermediateThrowEvent: 'event',
                boundaryEvent: 'event',
            };

            // 节点图标映射
            const nodeIconMap = {
                start: 'el-icon-caret-right',
                end: 'el-icon-check',
                task: 'el-icon-document',
                gateway: 'el-icon-share',
                event: 'el-icon-bell',
                subprocess: 'el-icon-folder-opened',
                default: 'el-icon-document',
            };

            // 收集所有BPMN元素
            const allElements = process.children;
            const nodeMap = new Map();

            // 第一遍：创建所有节点
            Array.from(allElements).forEach((element) => {
                const tagName = element.tagName;
                const id = element.getAttribute('id');
                const name = element.getAttribute('name') || this.getDefaultName(tagName);

                if (nodeTypeMap[tagName]) {
                    const type = nodeTypeMap[tagName];
                    const icon = nodeIconMap[type] || nodeIconMap.default;

                    const node = {
                        id: id,
                        name: name,
                        type: type,
                        icon: icon,
                        x: baseX + nodeCounter * horizontalSpacing,
                        y: baseY + (nodeCounter % 3) * verticalSpacing, // 交错排列
                        originalType: tagName, // 保存原始类型
                        attributes: this.extractAttributes(element),
                    };

                    this.bpmnNodes.push(node);
                    nodeMap.set(id, node);
                    nodeCounter++;
                }
            });

            // 第二遍：解析连接关系
            Array.from(allElements).forEach((element) => {
                const tagName = element.tagName;

                if (tagName === 'sequenceFlow') {
                    const id = element.getAttribute('id');
                    const source = element.getAttribute('sourceRef');
                    const target = element.getAttribute('targetRef');
                    const name = element.getAttribute('name') || '';

                    // 检查源和目标节点是否存在
                    const sourceNode = nodeMap.get(source);
                    const targetNode = nodeMap.get(target);

                    if (sourceNode && targetNode) {
                        this.connections.push({
                            id: id,
                            source: source,
                            target: target,
                            configured: false,
                            condition: name,
                            type: 'sequence',
                        });
                    }
                }

                // 解析消息流
                if (tagName === 'messageFlow') {
                    const id = element.getAttribute('id');
                    const source = element.getAttribute('sourceRef');
                    const target = element.getAttribute('targetRef');

                    const sourceNode = nodeMap.get(source);
                    const targetNode = nodeMap.get(target);

                    if (sourceNode && targetNode) {
                        this.connections.push({
                            id: id,
                            source: source,
                            target: target,
                            configured: false,
                            condition: '消息',
                            type: 'message',
                        });
                    }
                }

                // 解析关联
                if (tagName === 'association') {
                    const id = element.getAttribute('id');
                    const source = element.getAttribute('sourceRef');
                    const target = element.getAttribute('targetRef');

                    const sourceNode = nodeMap.get(source);
                    const targetNode = nodeMap.get(target);

                    if (sourceNode && targetNode) {
                        this.connections.push({
                            id: id,
                            source: source,
                            target: target,
                            configured: false,
                            condition: '关联',
                            type: 'association',
                        });
                    }
                }
            });

            // 解析BPMN图形布局
            this.parseBpmnLayout(xmlDoc, nodeMap);

            // 确保连接线计算
            this.$nextTick(() => {
                this.calculateConnections();
            });
        },

        // 获取节点默认名称
        getDefaultName(tagName) {
            const nameMap = {
                startEvent: '开始',
                endEvent: '结束',
                terminateEvent: '终止',
                userTask: '用户任务',
                serviceTask: '服务任务',
                scriptTask: '脚本任务',
                businessRuleTask: '业务规则',
                sendTask: '发送任务',
                receiveTask: '接收任务',
                manualTask: '手工任务',
                callActivity: '调用活动',
                exclusiveGateway: '排他网关',
                parallelGateway: '并行网关',
                inclusiveGateway: '包容网关',
                eventBasedGateway: '事件网关',
                complexGateway: '复杂网关',
                subProcess: '子流程',
                adHocSubProcess: '特殊子流程',
                transaction: '事务',
                intermediateCatchEvent: '中间捕获事件',
                intermediateThrowEvent: '中间抛出事件',
                boundaryEvent: '边界事件',
                errorEvent: '错误事件',
                messageEvent: '消息事件',
                timerEvent: '定时器事件',
                escalationEvent: '升级事件',
                conditionalEvent: '条件事件',
                signalEvent: '信号事件',
            };

            return nameMap[tagName] || '未命名节点';
        },

        // 提取节点属性
        extractAttributes(element) {
            const attributes = {};
            const tagName = element.tagName;

            // 通用属性
            attributes.id = element.getAttribute('id');
            attributes.name = element.getAttribute('name');

            // 特定类型属性
            switch (tagName) {
                case 'userTask':
                    attributes.assignee = element.getAttribute('assignee');
                    attributes.candidateUsers = element.getAttribute('candidateUsers');
                    attributes.candidateGroups = element.getAttribute('candidateGroups');
                    break;

                case 'serviceTask':
                    attributes.service = element.getAttribute('service');
                    attributes.operation = element.getAttribute('operation');
                    break;

                case 'scriptTask':
                    attributes.scriptFormat = element.getAttribute('scriptFormat');
                    break;

                case 'timerEvent':
                    attributes.timerDefinition = element.getAttribute('timerDefinition');
                    break;

                case 'messageEvent':
                    attributes.messageRef = element.getAttribute('messageRef');
                    break;

                case 'callActivity':
                    attributes.calledElement = element.getAttribute('calledElement');
                    break;

                case 'subProcess':
                    attributes.triggeredByEvent = element.getAttribute('triggeredByEvent');
                    break;
            }

            return attributes;
        },

        // 增强的BPMN图形布局解析
        parseBpmnLayout(xmlDoc, nodeMap) {
            const shapes = xmlDoc.getElementsByTagName('bpmndi:BPMNShape');
            Array.from(shapes).forEach((shape) => {
                const elementId = shape.getAttribute('bpmnElement');
                const bounds = shape.getElementsByTagName('omgdc:Bounds')[0];

                if (bounds) {
                    const x = parseInt(bounds.getAttribute('x')) || 0;
                    const y = parseInt(bounds.getAttribute('y')) || 0;
                    const width = parseInt(bounds.getAttribute('width')) || 100;
                    const height = parseInt(bounds.getAttribute('height')) || 80;

                    const node = nodeMap.get(elementId);
                    if (node) {
                        // 将BPMN坐标转换为画布坐标
                        node.x = x / 2;
                        node.y = y / 2;
                        node.width = width / 2;
                        node.height = height / 2;
                    }
                }
            });

            // 解析连线布局
            const edges = xmlDoc.getElementsByTagName('bpmndi:BPMNEdge');
            Array.from(edges).forEach((edge) => {
                const elementId = edge.getAttribute('bpmnElement');
                const waypoints = edge.getElementsByTagName('omgdi:waypoint');

                if (waypoints.length > 0) {
                    const connection = this.connections.find((conn) => conn.id === elementId);
                    if (connection) {
                        connection.waypoints = Array.from(waypoints).map((wp) => ({
                            x: parseInt(wp.getAttribute('x')) / 2,
                            y: parseInt(wp.getAttribute('y')) / 2,
                        }));
                    }
                }
            });
        },

        // 增强的节点图标获取
        getNodeIcon(node) {
            // 如果有自定义图标则使用，否则根据类型返回
            if (node.icon) {
                return node.icon;
            }

            const icons = {
                start: 'el-icon-caret-right',
                end: 'el-icon-check',
                task: 'el-icon-document',
                gateway: 'el-icon-share',
                event: 'el-icon-bell',
                subprocess: 'el-icon-folder-opened',
                default: 'el-icon-document',
            };

            return icons[node.type] || icons.default;
        },

        // 增强的节点类型文本
        getNodeTypeText(node) {
            const typeMap = {
                start: '开始节点',
                end: '结束节点',
                task: '任务节点',
                gateway: '网关节点',
                event: '事件节点',
                subprocess: '子流程',
                default: '未知节点',
            };

            // 如果有原始类型，显示更详细的类型信息
            if (node.originalType) {
                const detailMap = {
                    userTask: '用户任务',
                    serviceTask: '服务任务',
                    scriptTask: '脚本任务',
                    businessRuleTask: '业务规则任务',
                    sendTask: '发送任务',
                    receiveTask: '接收任务',
                    manualTask: '手工任务',
                    callActivity: '调用活动',
                    exclusiveGateway: '排他网关',
                    parallelGateway: '并行网关',
                    inclusiveGateway: '包容网关',
                    eventBasedGateway: '事件网关',
                    subProcess: '嵌入子流程',
                    adHocSubProcess: '特殊子流程',
                    transaction: '事务子流程',
                    startEvent: '开始事件',
                    endEvent: '结束事件',
                    terminateEvent: '终止事件',
                    intermediateCatchEvent: '中间捕获事件',
                    intermediateThrowEvent: '中间抛出事件',
                    boundaryEvent: '边界事件',
                };

                return detailMap[node.originalType] || typeMap[node.type] || typeMap.default;
            }

            return typeMap[node.type] || typeMap.default;
        },

        // 解析BPMN图形布局
        parseBpmnLayout(xmlDoc) {
            const shapes = xmlDoc.getElementsByTagName('bpmndi:BPMNShape');
            Array.from(shapes).forEach((shape) => {
                const elementId = shape.getAttribute('bpmnElement');
                const bounds = shape.getElementsByTagName('omgdc:Bounds')[0];
                if (bounds) {
                    const x = parseInt(bounds.getAttribute('x')) || 0;
                    const y = parseInt(bounds.getAttribute('y')) || 0;

                    const node = this.bpmnNodes.find((n) => n.id === elementId);
                    if (node) {
                        // 将BPMN坐标转换为画布坐标
                        node.x = x / 2;
                        node.y = y / 2;
                    }
                }
            });
        },

        // 节点选择
        selectNode(node) {
            if (this.isDragging) return; // 拖动时不触发选择
            this.selectedNode = node;
            const existingConfig = this.configTable.find((item) => item.nodeId === node.id);
            if (existingConfig) {
                this.currentConfig = { ...existingConfig };
            } else {
                this.currentConfig = { role: '', permissions: [], remark: '' };
            }
        },

        // 节点图标
        getNodeIcon(type) {
            const icons = {
                start: 'el-icon-caret-right',
                task: 'el-icon-document',
                gateway: 'el-icon-share',
                end: 'el-icon-check',
            };
            return icons[type] || 'el-icon-document';
        },

        // 节点状态
        getNodeStatus(node) {
            return this.configTable.some((item) => item.nodeId === node.id);
        },

        // 节点类型标签
        getNodeTypeTag(type) {
            const typeMap = {
                start: 'success',
                task: '',
                gateway: 'warning',
                end: 'info',
            };
            return typeMap[type] || '';
        },

        // 节点类型文本
        getNodeTypeText(type) {
            const textMap = {
                start: '开始节点',
                task: '任务节点',
                gateway: '网关节点',
                end: '结束节点',
            };
            return textMap[type] || '未知节点';
        },

        // 根据节点ID获取节点类型
        getNodeType(nodeId) {
            const node = this.bpmnNodes.find((item) => item.id === nodeId);
            return node ? node.type : 'task';
        },

        // 优化的拖动功能
        startDrag(node, event) {
            event.preventDefault();
            event.stopPropagation();

            this.isDragging = true;
            this.dragNode = node;

            // 获取画布相对位置
            const rect = this.$refs.canvas.getBoundingClientRect();
            this.startX = event.clientX - rect.left - node.x;
            this.startY = event.clientY - rect.top - node.y;

            this.lastDragTime = Date.now();

            // 添加拖动样式
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        },

        handleCanvasDrag(event) {
            if (!this.isDragging || !this.dragNode) return;

            const now = Date.now();
            if (now - this.lastDragTime < this.dragThrottle) return;
            this.lastDragTime = now;

            requestAnimationFrame(() => {
                if (!this.dragNode) return;

                // 实时获取画布尺寸
                const canvas = this.$refs.canvas;
                if (!canvas) return;

                const rect = canvas.getBoundingClientRect();
                const canvasWidth = rect.width;
                const canvasHeight = rect.height;

                const canvasX = event.clientX - rect.left;
                const canvasY = event.clientY - rect.top;

                this.dragNode.x = canvasX - this.startX;
                this.dragNode.y = canvasY - this.startY;

                // 使用实时计算的边界
                const margin = 10;
                const nodeWidth = 100;
                const nodeHeight = 60;

                const maxX = canvasWidth - nodeWidth - margin;
                const maxY = canvasHeight - nodeHeight - margin;

                this.dragNode.x = Math.max(margin, Math.min(maxX, this.dragNode.x));
                this.dragNode.y = Math.max(margin, Math.min(maxY, this.dragNode.y));

                this.calculateConnections();
            });
        },

        stopDrag() {
            if (this.isDragging) {
                this.isDragging = false;
                this.dragNode = null;

                // 恢复样式
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
            }
        },

        // 计算连接线路径
        calculateConnections() {
            this.connections.forEach((conn) => {
                const source = this.bpmnNodes.find((n) => n.id === conn.source);
                const target = this.bpmnNodes.find((n) => n.id === conn.target);

                if (source && target) {
                    const startX = source.x + 80; // 节点宽度
                    const startY = source.y + 30; // 节点高度的一半
                    const endX = target.x;
                    const endY = target.y + 30;

                    // 计算控制点，创建平滑曲线
                    const controlX1 = startX + (endX - startX) * 0.5;
                    const controlX2 = startX + (endX - startX) * 0.5;

                    conn.path = `M ${startX} ${startY} C ${controlX1} ${startY} ${controlX2} ${endY} ${endX} ${endY}`;
                    conn.textX = (startX + endX) / 2;
                    conn.textY = (startY + endY) / 2 - 10;
                }
            });
        },

        // 网关配置
        showGatewayConfig() {
            if (this.selectedNode && this.selectedNode.type === 'gateway') {
                this.selectedGateway = this.selectedNode;
                this.gatewayDialogVisible = true;
            }
        },

        addBranch() {
            const newId = 'b' + (this.gatewayBranches.length + 1);
            this.gatewayBranches.push({
                id: newId,
                name: '分支' + (this.gatewayBranches.length + 1),
                condition: '',
                target: '',
            });
        },

        removeBranch(index) {
            this.gatewayBranches.splice(index, 1);
        },

        saveGatewayConfig() {
            // 更新连接线
            this.connections = this.connections.filter(
                (conn) => conn.source !== this.selectedGateway.id,
            );

            this.gatewayBranches.forEach((branch) => {
                if (branch.target) {
                    this.connections.push({
                        id: 'c_' + this.selectedGateway.id + '_' + branch.target,
                        source: this.selectedGateway.id,
                        target: branch.target,
                        configured: true,
                        condition: branch.condition,
                    });
                }
            });

            this.gatewayDialogVisible = false;
            this.$message.success('网关分支配置已保存');
            this.calculateConnections();
        },

        updateNodeName() {
            this.calculateConnections();
        },

        // 配置管理
        saveConfig() {
            if (!this.selectedNode) {
                this.$message.warning('请先选择一个节点');
                return;
            }

            if (
                !this.currentConfig.role &&
                this.selectedNode.type !== 'start' &&
                this.selectedNode.type !== 'end'
            ) {
                this.$message.warning('请选择角色');
                return;
            }

            const index = this.configTable.findIndex(
                (item) => item.nodeId === this.selectedNode.id,
            );
            const configData = {
                nodeId: this.selectedNode.id,
                ...this.currentConfig,
            };

            if (index !== -1) {
                this.configTable.splice(index, 1, configData);
                this.$message.success('配置更新成功');
            } else {
                this.configTable.push(configData);
                this.$message.success('配置保存成功');
            }

            // 更新连接线状态
            this.updateConnectionStatus();
        },

        updateConnectionStatus() {
            this.connections.forEach((conn) => {
                const sourceConfigured = this.configTable.some(
                    (item) => item.nodeId === conn.source,
                );
                const targetConfigured = this.configTable.some(
                    (item) => item.nodeId === conn.target,
                );
                conn.configured = sourceConfigured && targetConfigured;
            });
        },

        clearConfig() {
            this.currentConfig = { role: '', permissions: [], remark: '' };
        },

        editConfig(config) {
            const node = this.bpmnNodes.find((item) => item.id === config.nodeId);
            if (node) {
                this.selectNode(node);
            }
        },

        deleteConfig(nodeId) {
            this.$confirm('确定删除此配置吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.configTable = this.configTable.filter((item) => item.nodeId !== nodeId);
                this.$message.success('删除成功');
                this.updateConnectionStatus();

                if (this.selectedNode && this.selectedNode.id === nodeId) {
                    this.currentConfig = { role: '', permissions: [], remark: '' };
                }
            });
        },

        exportConfig() {
            if (this.configTable.length === 0) {
                this.$message.warning('没有配置数据可导出');
                return;
            }

            const dataStr = JSON.stringify(this.configTable, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = 'bpmn_config.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            this.$message.success('配置导出成功');
        },
    },
};
</script>

<style scoped>
.model {
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
    background-color: #f5f7fa;
    padding: 20px;
    min-height: 100vh;
    user-select: none; /* 全局禁止文本选择 */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px 20px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header h1 {
    color: #303133;
    font-weight: 500;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.content {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    min-height: 600px;
    height: calc(100vh - 180px); /* 自适应高度 */
}

/* 平分布局 */
.canvas-container {
    flex: 1; /* 平等分配空间 */
    padding: 20px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-width: 0; /* 防止内容溢出 */
}

.process-canvas {
    flex: 1;
    position: relative;
    background: #fafafa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: auto; /* 允许滚动 */
    min-height: 400px;
    cursor: default; /* 默认光标 */
    width: 100%; /* 确保占满容器 */
}

.config-container {
    flex: 1; /* 平等分配空间 */
    padding: 20px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    min-width: 0; /* 防止内容溢出 */
    overflow: hidden; /* 防止内容溢出 */
}

/* 流程节点样式 */
.process-node {
    position: absolute;
    min-width: 80px;
    height: 60px;
    background: white;
    border: 2px solid #dcdfe6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: grab; /* 抓取光标 */
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    user-select: none; /* 禁止节点内文本选择 */
}

.process-node:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.process-node:active {
    cursor: grabbing; /* 抓取中光标 */
}

.node-active {
    border-color: #409eff !important;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3) !important;
}

.node-configured {
    border-color: #67c23a !important;
}

/* 节点类型特定样式 */
.node-start {
    border-color: #67c23a;
    background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
}

.node-task {
    border-color: #409eff;
    background: linear-gradient(135deg, #f0f6ff, #ecf5ff);
}

.node-gateway {
    border-color: #e6a23c;
    background: linear-gradient(135deg, #fdf6ec, #fef0e0);
    min-width: 100px;
}

.node-end {
    border-color: #909399;
    background: linear-gradient(135deg, #f4f4f5, #f0f0f1);
}

.node-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    flex-shrink: 0;
    color: white;
    font-size: 16px;
    cursor: inherit; /* 继承父级光标 */
    user-select: none; /* 禁止图标选择 */
}

.node-start .node-icon {
    background: #67c23a;
}

.node-task .node-icon {
    background: #409eff;
}

.node-gateway .node-icon {
    background: #e6a23c;
    transform: rotate(45deg);
}

.node-gateway .node-icon i {
    transform: rotate(-45deg);
}

.node-end .node-icon {
    background: #909399;
}

.node-content {
    flex: 1;
    min-width: 0;
    cursor: inherit; /* 继承父级光标 */
    user-select: none; /* 禁止内容选择 */
}

.node-title {
    font-weight: 600;
    font-size: 14px;
    color: #303133;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: inherit;
    user-select: none;
}

.node-id {
    font-size: 11px;
    color: #909399;
    cursor: inherit;
    user-select: none;
}

.node-status {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    background: #67c23a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    cursor: inherit;
    user-select: none;
}

/* 连接线样式 */
.connection-layer {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
    width: 100%;
    height: 100%;
}

.connection-line {
    fill: none;
    stroke: #c0c4cc;
    stroke-width: 2;
    transition: all 0.3s;
}

.connection-line:hover {
    stroke-width: 3;
}

.connection-configured {
    stroke: #67c23a;
    stroke-width: 2;
}

.connection-label {
    font-size: 12px;
    fill: #606266;
    background: white;
    padding: 2px 4px;
    border-radius: 2px;
}

.table-wrapper {
    flex: 1;
    overflow-y: auto;
    max-height: none; /* 移除固定高度 */
}

.config-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    min-width: 500px; /* 调整最小宽度 */
}

.config-table th,
.config-table td {
    border: 1px solid #ebeef5;
    padding: 12px 15px;
    text-align: left;
    white-space: nowrap;
}

.config-table th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
    position: sticky;
    top: 0;
}

.config-table tr:nth-child(even) {
    background-color: #fafafa;
}

.empty-config {
    text-align: center;
    color: #909399;
    padding: 40px 0;
}

.config-form {
    margin-top: 20px;
}

.step-tip {
    margin: 10px 0;
    color: #606266;
}

.no-selection-tip {
    color: #909399;
    margin-top: 20px;
}

.config-table-title {
    margin-top: 30px;
}

.delete-btn {
    color: #f56c6c;
}

/* 网关配置样式 */
.gateway-config {
    padding: 10px 0;
}

/* 响应式布局 */
@media (max-width: 1200px) {
    .content {
        flex-direction: column;
        height: auto;
    }

    .canvas-container,
    .config-container {
        min-height: 500px;
    }
}
/* 连接线类型样式 */
.connection-line.sequence {
    stroke: #409eff;
}

.connection-line.message {
    stroke: #e6a23c;
    stroke-dasharray: 5, 5;
}

.connection-line.association {
    stroke: #909399;
    stroke-dasharray: 3, 3;
}

.connection-line.data {
    stroke: #67c23a;
    stroke-dasharray: 8, 3;
}
/* 事件节点样式 */
.node-event {
    border-color: #f56c6c;
    background: linear-gradient(135deg, #fef0f0, #fde2e2);
}

.node-event .node-icon {
    background: #f56c6c;
}

/* 子流程节点样式 */
.node-subprocess {
    border-color: #8e44ad;
    background: linear-gradient(135deg, #f9f0ff, #efdbff);
    border-style: dashed;
}

.node-subprocess .node-icon {
    background: #8e44ad;
}

/* 不同类型任务的样式 */
.node-task[data-original-type='serviceTask'] {
    border-color: #3498db;
    background: linear-gradient(135deg, #e6f7ff, #d1eaff);
}

.node-task[data-original-type='scriptTask'] {
    border-color: #9b59b6;
    background: linear-gradient(135deg, #f9f0ff, #f2e6ff);
}

.node-task[data-original-type='businessRuleTask'] {
    border-color: #e74c3c;
    background: linear-gradient(135deg, #fff2e8, #ffe7d9);
}
</style>
