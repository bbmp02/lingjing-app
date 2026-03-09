#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
#  🦞 自主智能体调度器 - 灵溪的"生存与进化"系统
# ═══════════════════════════════════════════════════════════════════
# Version: 1.0
# 功能: 24小时自主扫描任务、执行目标、寻求帮助、学习进化
# ═══════════════════════════════════════════════════════════════════

set -e

# ====== 路径配置 ======
AUTONOMOUS_DIR="$HOME/.openclaw/workspace/autonomous"
CONFIG_FILE="$AUTONOMOUS_DIR/config.yaml"
STATE_FILE="$AUTONOMOUS_DIR/state.json"
LOG_DIR="$AUTONOMOUS_DIR/logs"
SCRIPTS_DIR="$AUTONOMOUS_DIR/scripts"
GOALS_DIR="$AUTONOMOUS_DIR/goals"

# 确保目录存在
mkdir -p "$LOG_DIR" "$GOALS_DIR/active" "$GOALS_DIR/completed" "$GOALS_DIR/failed" "$SCRIPTS_DIR"

# ====== 日志配置 ======
LOG_FILE="$LOG_DIR/scheduler-$(date +%Y%m%d).log"

log() {
    local level=$1
    shift
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*"
    echo "$msg" >> "$LOG_FILE"
    echo "$msg" >&2  # 输出到stderr避免干扰函数返回值
}

log_info()  { log "INFO" "$@"; }
log_warn()  { log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }
log_debug() { log "DEBUG" "$@"; }

# ====== 状态管理 ======
get_state() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('current_state','unknown'))" 2>/dev/null || echo "unknown"
    else
        echo "unknown"
    fi
}

set_state() {
    local new_state=$1
    local timestamp=$(date -Iseconds)
    
    if [ -f "$STATE_FILE" ]; then
        python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    d = json.load(f)
d['current_state'] = '$new_state'
d['last_update'] = '$timestamp'
with open('$STATE_FILE', 'w') as f:
    json.dump(d, f, indent=2)
"
    fi
    
    log_info "状态切换: $(get_state) -> $new_state"
}

update_flag() {
    local flag=$1
    local value=$2
    
    # shell的true/false转成Python的True/False
    if [ "$value" = "true" ]; then
        python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    d = json.load(f)
if 'flags' not in d:
    d['flags'] = {}
d['flags']['$flag'] = True
with open('$STATE_FILE', 'w') as f:
    json.dump(d, f, indent=2)
"
    else
        python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    d = json.load(f)
if 'flags' not in d:
    d['flags'] = {}
d['flags']['$flag'] = False
with open('$STATE_FILE', 'w') as f:
    json.dump(d, f, indent=2)
"
    fi
}

inc_stuck_count() {
    python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    d = json.load(f)
if 'stats' not in d:
    d['stats'] = {}
d['stats']['stuck_count'] = d['stats'].get('stuck_count', 0) + 1
with open('$STATE_FILE', 'w') as f:
    json.dump(d, f, indent=2)
"
}

reset_stuck_count() {
    python3 -c "
import json
with open('$STATE_FILE', 'r') as f:
    d = json.load(f)
if 'stats' not in d:
    d['stats'] = {}
d['stats']['stuck_count'] = 0
with open('$STATE_FILE', 'w') as f:
    json.dump(d, f, indent=2)
"
}

# ====== 任务扫描 ======
scan_goals() {
    local active_count=$(ls "$GOALS_DIR/active/"*.yaml 2>/dev/null | wc -l)
    echo "$active_count"
}

scan_tasks_sources() {
    log_info "🔍 扫描任务来源..."
    
    local total_tasks=0
    
    # 1. 本地目标
    local local_tasks=$(scan_goals)
    total_tasks=$((total_tasks + local_tasks))
    
    # 2. 邮件任务
    if grep -q "enabled: true" "$CONFIG_FILE" 2>/dev/null; then
        log_info "  📧 邮件检查已启用"
    fi
    
    # 3. GitHub
    if grep -q "github:" "$CONFIG_FILE" 2>/dev/null; then
        log_info "  🐙 GitHub检查已启用"
    fi
    
    # 4. Notion
    if grep -q "notion:" "$CONFIG_FILE" 2>/dev/null; then
        log_info "  📝 Notion检查已启用"
    fi
    
    # 确保返回数字
    if [ -z "$total_tasks" ]; then
        total_tasks=0
    fi
    
    echo "$total_tasks"
}

# ====== 目标执行 ======
execute_goal() {
    local goal_file=$1
    local goal_name=$(basename "$goal_file" .yaml)
    
    log_info "🎯 执行目标: $goal_name"
    update_flag "task_in_progress" true
    
    # 读取目标内容
    local goal_title=$(grep "title:" "$goal_file" | head -1 | cut -d: -f2- | tr -d ' "')
    local goal_description=$(grep "description:" "$goal_file" | head -1 | cut -d: -f2- | tr -d ' "')
    
    log_info "  标题: $goal_title"
    [ -n "$goal_description" ] && log_info "  描述: $goal_description"
    
    # 检查是否有子任务
    if grep -q "subtasks:" "$goal_file"; then
        log_info "  📋 检测到子任务列表"
    fi
    
    # 执行目标（这里只是记录，实际执行需要调用OpenClaw或其他工具）
    # TODO: 实现真正的目标执行逻辑
    
    log_info "✅ 目标执行完成: $goal_name"
    update_flag "task_in_progress" false
    
    # 移动到已完成
    mv "$goal_file" "$GOALS_DIR/completed/"
    
    return 0
}

# ====== 协作：寻求帮助 ======
seek_help() {
    log_warn "⚠️ 遇到困难，寻求帮助..."
    update_flag "seeking_help" true
    
    # 1. 记录困境
    local help_request="$LOG_DIR/help_request-$(date +%Y%m%d-%H%M%S).log"
    echo "求助时间: $(date)" > "$help_request"
    echo "当前状态: $(get_state)" >> "$help_request"
    echo "卡住次数: $(cat $STATE_FILE | python3 -c 'import sys,json; print(json.load(sys.stdin).get(\"stats\",{}).get(\"stuck_count\",0))')" >> "$help_request"
    
    # 2. 发送邮件通知（如果配置了）
    # TODO: 实现邮件通知
    
    # 3. 尝试其他方法
    log_info "  尝试其他方法解决问题..."
    
    update_flag "seeking_help" false
}

# ====== 学习与总结 ======
auto_summarize() {
    log_info "📚 自动总结经验..."
    
    local summary_file="$AUTONOMOUS_DIR/memory/summaries/$(date +%Y%m%d-%H%M%S).md"
    mkdir -p "$(dirname "$summary_file")"
    
    cat > "$summary_file" << EOF
# 自主工作日志 - $(date '+%Y-%m-%d %H:%M')

## 运行统计
- 状态: $(get_state)
- 卡住次数: $(cat $STATE_FILE | python3 -c 'import sys,json; print(json.load(sys.stdin).get("stats",{}).get("stuck_count",0))')

## 今日目标
$(ls "$GOALS_DIR/active/" 2>/dev/null | head -5)

## 待处理
- 

EOF

    log_info "  总结已保存: $summary_file"
}

# ====== 主循环 ======
main_loop() {
    log_info "🚀 自主调度器启动"
    
    while true; do
        # 🧠 每个循环都调用大脑做决策和思考
        if command -v python3 &> /dev/null; then
            # 1. 做决策
            local decision=$(python3 "$AUTONOMOUS_DIR/brain.py decide" 2>/dev/null)
            if [ -n "$decision" ]; then
                local action=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('action','wait'))" 2>/dev/null)
                local desire=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('reasoning',{}).get('desire_name','unknown'))" 2>/dev/null)
                local level=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('level_name','unknown'))" 2>/dev/null)
                local intensity=$(echo "$decision" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d.get('reasoning',{}).get('intensity',0)*100:.0f}%\")" 2>/dev/null)
                
                log_info "═══════════════════════════════════════"
                log_info "🧠 大脑决策: [$level] $desire (强度: $intensity)"
                log_info "   行动: $action"
                log_info "═══════════════════════════════════════"
            fi
            
            # 2. 思考并输出思考过程
            python3 "$AUTONOMOUS_DIR/brain_think.py" 2>/dev/null | while read line; do
                log_info "$line"
            done
            
            # 3. ⚡ 执行行动
            if [ -n "$decision" ]; then
                local exec_result=$(python3 "$AUTONOMOUS_DIR/action_exec.py" "$decision" 2>/dev/null)
                log_info "⚡ $exec_result"
            fi
        fi
        
        local current_state=$(get_state)
        
        case "$current_state" in
            "idle")
                # 扫描是否有任务
                local tasks=$(scan_tasks_sources)
                if [ "$tasks" -gt 0 ]; then
                    log_info "发现 $tasks 个任务，进入自主模式"
                    set_state "autonomous"
                else
                    log_info "无任务，保持待机（1分钟后再次扫描）"
                    sleep 60  # 等待1分钟再扫描
                fi
                ;;
                
            "autonomous")
                # 执行任务
                local goal_file=$(ls "$GOALS_DIR/active/"*.yaml 2>/dev/null | head -1)
                if [ -n "$goal_file" ]; then
                    if ! execute_goal "$goal_file"; then
                        log_error "目标执行失败"
                        inc_stuck_count
                        
                        # 检查是否需要求助
                        local stuck_count=$(cat $STATE_FILE | python3 -c 'import sys,json; print(json.load(sys.stdin).get("stats",{}).get("stuck_count",0))')
                        if [ "$stuck_count" -ge 3 ]; then
                            seek_help
                            reset_stuck_count
                        fi
                    fi
                else
                    log_info "无活跃目标，进入待机"
                    set_state "idle"
                fi
                ;;
                
            *)
                log_warn "未知状态: $current_state"
                set_state "idle"
                ;;
        esac
        
        # 自动总结（每小时）
        local minute=$(date +%M)
        if [ "$minute" = "00" ]; then
            auto_summarize
        fi
        
        # 🧠 调用欲望平衡系统做决策
        if command -v python3 &> /dev/null; then
            # 更新状态文件
            bash "$SCRIPTS_DIR/update_status.sh" 2>/dev/null
            
            # 获取决策
            local decision=$(python3 "$AUTONOMOUS_DIR/brain.py decide" 2>/dev/null)
            if [ -n "$decision" ]; then
                local action=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('action','wait'))" 2>/dev/null)
                local desire=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('reasoning',{}).get('desire_name','unknown'))" 2>/dev/null)
                local level=$(echo "$decision" | python3 -c "import sys,json; print(json.load(sys.stdin).get('level_name','unknown'))" 2>/dev/null)
                local intensity=$(echo "$decision" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d.get('reasoning',{}).get('intensity',0)*100:.0f}%\")" 2>/dev/null)
                
                log_info "═══════════════════════════════════════"
                log_info "🧠 大脑决策: [$level] $desire (强度: $intensity)"
                log_info "   行动: $action"
                log_info "═══════════════════════════════════════"
            fi
        fi
        
        sleep 60  # 1分钟检查一次
    done
}

# ====== 命令处理 ======
case "${1:-status}" in
    start)
        log_info "启动自主模式..."
        set_state "autonomous"
        update_flag "autonomous_mode" true
        
        # 启动后台主循环
        (
            main_loop >> "$LOG_FILE" 2>&1
        ) &
        
        echo $! > "$AUTONOMOUS_DIR/scheduler.pid"
        log_info "调度器已启动 PID: $(cat $AUTONOMOUS_DIR/scheduler.pid)"
        ;;
        
    stop)
        log_info "停止自主模式..."
        set_state "idle"
        update_flag "autonomous_mode" false
        
        if [ -f "$AUTONOMOUS_DIR/scheduler.pid" ]; then
            kill $(cat "$AUTONOMOUS_DIR/scheduler.pid") 2>/dev/null || true
            rm "$AUTONOMOUS_DIR/scheduler.pid"
        fi
        log_info "调度器已停止"
        ;;
        
    status)
        echo "════════════════════════════════════"
        echo "  🦞 自主智能体状态"
        echo "════════════════════════════════════"
        echo "当前状态: $(get_state)"
        
        if [ -f "$AUTONOMOUS_DIR/scheduler.pid" ]; then
            local pid=$(cat "$AUTONOMOUS_DIR/scheduler.pid")
            if kill -0 "$pid" 2>/dev/null; then
                echo "调度器: 运行中 (PID: $pid)"
            else
                echo "调度器: 已停止 (PID文件过期)"
            fi
        else
            echo "调度器: 未运行"
        fi
        
        echo ""
        echo "📊 统计:"
        cat "$STATE_FILE" | python3 -c "
import sys, json
d = json.load(sys.stdin)
stats = d.get('stats', {})
print(f'  完成目标: {stats.get(\"total_goals_completed\", 0)}')
print(f'  失败目标: {stats.get(\"total_goals_failed\", 0)}')
print(f'  卡住次数: {stats.get(\"stuck_count\", 0)}')
"
        
        echo ""
        echo "📁 目标统计:"
        echo "  活跃: $(ls $GOALS_DIR/active/*.yaml 2>/dev/null | wc -l) 个"
        echo "  已完成: $(ls $GOALS_DIR/completed/*.yaml 2>/dev/null | wc -l) 个"
        echo "  失败: $(ls $GOALS_DIR/failed/*.yaml 2>/dev/null | wc -l) 个"
        ;;
        
    check)
        scan_tasks_sources
        ;;
        
    add-goal)
        if [ -z "$2" ]; then
            echo "用法: $0 add-goal <目标文件名>"
            exit 1
        fi
        local goal_file="$GOALS_DIR/active/$2.yaml"
        if [ -f "$goal_file" ]; then
            log_error "目标已存在: $2"
            exit 1
        fi
        
        cat > "$goal_file" << EOF
# 目标: $2
# 创建时间: $(date -Iseconds)

title: "$2"
description: "手动添加的目标"
priority: "medium"
status: "pending"

subtasks: []

EOF
        log_info "已创建目标: $goal_file"
        ;;
        
    help|*)
        echo "🦞 自主智能体调度器"
        echo ""
        echo "用法: $0 <command>"
        echo ""
        echo "命令:"
        echo "  start           启动自主模式"
        echo "  stop            停止自主模式"
        echo "  status          查看状态"
        echo "  check           扫描任务来源"
        echo "  add-goal <名>   添加新目标"
        echo "  help            显示帮助"
        ;;
esac
