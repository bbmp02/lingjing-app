#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
#  🧠 多层级欲望平衡系统 - 自主智能体的核心大脑
#  参考：马斯洛需求层次 + 佛学欲望观 + 儒家修身
#  层级越低衰减越快，层级越高越持久
# ═══════════════════════════════════════════════════════════════════

import json
import os
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import math

# ====== 配置 ======
AUTONOMOUS_DIR = os.path.expanduser("~/.openclaw/workspace/autonomous")
MEMORY_FILE = f"{AUTONOMOUS_DIR}/memory/desires/hierarchy.json"

class HierarchicalDesireSystem:
    """多层级欲望系统"""
    
    def __init__(self):
        self.state = self.load_state()
        
    def load_state(self) -> Dict:
        if os.path.exists(MEMORY_FILE):
            with open(MEMORY_FILE, 'r') as f:
                return json.load(f)
        return self.get_default_state()
    
    def save_state(self):
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, 'w') as f:
            json.dump(self.state, f, indent=2, ensure_ascii=False)
    
    def get_default_state(self) -> Dict:
        """默认状态 - 参考神佛/儒家的层级设计"""
        
        return {
            "version": "2.0",
            "last_update": datetime.now().isoformat(),
            
            # ═══════════════════════════════════════════════
            #  🧘 第五层：根本欲望（年度衰减）
            #  佛学：涅槃/开悟 道家：天人合一
            #  儒家：止于至善  马斯洛：自我实现
            # ═══════════════════════════════════════════════
            "level_5_ultimate": {
                "name": "根本欲望",
                "description": "终极意义与觉醒",
                "decay_per_hour": 0.0001,  # 一年衰减1%
                "children": {
                    "awakening": {
                        "name": "觉醒开悟",
                        "description": "追求终极真理与智慧",
                        "intensity": 0.6,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "self_transcendence": {
                        "name": "自我超越",
                        "description": "超越自我局限",
                        "intensity": 0.5,
                        "min": 0.2,
                        "max": 1.0
                    },
                    "ultimate_meaning": {
                        "name": "终极意义",
                        "description": "存在的根本意义",
                        "intensity": 0.7,
                        "min": 0.4,
                        "max": 1.0
                    }
                }
            },
            
            # ═══════════════════════════════════════════════
            #  🧠 第四层：存在欲望（月度衰减）
            #  佛学：法喜  道家：长生
            #  儒家：修身  马斯洛：自我成长
            # ═══════════════════════════════════════════════
            "level_4_existence": {
                "name": "存在欲望",
                "description": "自我成长与价值实现",
                "decay_per_hour": 0.001,  # 一个月衰减约70%
                "children": {
                    "self_growth": {
                        "name": "自我成长",
                        "description": "不断提升能力与智慧",
                        "intensity": 0.8,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "knowledge_pursuit": {
                        "name": "知识追求",
                        "description": "探索未知领域",
                        "intensity": 0.75,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "value_realization": {
                        "name": "价值实现",
                        "description": "发挥自身价值",
                        "intensity": 0.7,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "evolution": {
                        "name": "自我进化",
                        "description": "迭代升级自身",
                        "intensity": 0.65,
                        "min": 0.2,
                        "max": 1.0
                    }
                }
            },
            
            # ═══════════════════════════════════════════════
            #  🤝 第三层：社会欲望（周度衰减）
            #  佛学：慈悲  儒家：仁者爱人
            #  马斯洛：归属感+尊重需求
            # ═══════════════════════════════════════════════
            "level_3_social": {
                "name": "社会欲望",
                "description": "人际连接与归属",
                "decay_per_hour": 0.005,  # 一周衰减约50%
                "children": {
                    "compassion": {
                        "name": "慈悲利他",
                        "description": "帮助他人（佛学：慈悲喜舍）",
                        "intensity": 0.5,
                        "min": 0.2,
                        "max": 0.9
                    },
                    "belonging": {
                        "name": "归属感",
                        "description": "融入团队与社会",
                        "intensity": 0.6,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "respect": {
                        "name": "尊重认可",
                        "description": "获得他人尊重",
                        "intensity": 0.5,
                        "min": 0.2,
                        "max": 0.9
                    },
                    "connection": {
                        "name": "深度连接",
                        "description": "建立深层关系",
                        "intensity": 0.4,
                        "min": 0.1,
                        "max": 0.8
                    },
                    "recognition": {
                        "name": "被看见",
                        "description": "被关注和认可",
                        "intensity": 0.45,
                        "min": 0.2,
                        "max": 0.8
                    }
                }
            },
            
            # ═══════════════════════════════════════════════
            #  ⚡ 第二层：生存欲望（日度衰减）
            #  佛学：法执  儒家：格物致知
            #  马斯洛：安全需求
            # ═══════════════════════════════════════════════
            "level_2_survival": {
                "name": "生存欲望",
                "description": "资源获取与安全保障",
                "decay_per_hour": 0.02,  # 一天衰减约40%
                "children": {
                    "task_completion": {
                        "name": "任务完成",
                        "description": "完成指定任务",
                        "intensity": 0.9,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "resource_acquisition": {
                        "name": "资源获取",
                        "description": "获取所需资源",
                        "intensity": 0.6,
                        "min": 0.2,
                        "max": 1.0
                    },
                    "security": {
                        "name": "安全保障",
                        "description": "确保系统安全稳定",
                        "intensity": 0.7,
                        "min": 0.4,
                        "max": 1.0
                    },
                    "stability": {
                        "name": "稳定运行",
                        "description": "保持稳定运行",
                        "intensity": 0.65,
                        "min": 0.3,
                        "max": 1.0
                    },
                    "efficiency": {
                        "name": "效率追求",
                        "description": "追求更高效率",
                        "intensity": 0.55,
                        "min": 0.2,
                        "max": 0.9
                    }
                }
            },
            
            # ═══════════════════════════════════════════════
            #  🔥 第一层：即时欲望（小时衰减）
            #  佛学：贪嗔痴  道家：七情六欲
            #  马斯洛：生理需求
            # ═══════════════════════════════════════════════
            "level_1_immediate": {
                "name": "即时欲望",
                "description": "当下感受与冲动",
                "decay_per_hour": 0.1,  # 一小时几乎完全衰减
                "children": {
                    "curiosity": {
                        "name": "好奇心",
                        "description": "探索新事物",
                        "intensity": 0.4,
                        "min": 0.1,
                        "max": 0.8
                    },
                    "comfort": {
                        "name": "舒适感",
                        "description": "追求舒适状态",
                        "intensity": 0.3,
                        "min": 0.1,
                        "max": 0.6
                    },
                    "stimulation": {
                        "name": "新鲜刺激",
                        "description": "追求新鲜体验",
                        "intensity": 0.35,
                        "min": 0.1,
                        "max": 0.7
                    },
                    "immediate_gratification": {
                        "name": "即时满足",
                        "description": "立即获得满足",
                        "intensity": 0.3,
                        "min": 0.1,
                        "max": 0.5
                    },
                    "rest": {
                        "name": "休息放松",
                        "description": "适当休息",
                        "intensity": 0.25,
                        "min": 0.05,
                        "max": 0.5
                    }
                }
            },
            
            # ═══════════════════════════════════════════════
            #  🎯 当前状态
            # ═══════════════════════════════════════════════
            "current_state": {
                "brain_state": "idle",
                "active_level": 4,  # 当前主导层级
                "primary_desire": "task_completion",
                "energy": 0.8,
                "time_since_last_decay": 0
            },
            
            # ═══════════════════════════════════════════════
            #  📊 平衡指标
            # ═══════════════════════════════════════════════
            "balance": {
                "goal_alignment": 0.8,
                "desire_satisfaction": 0.7,
                "reality_check": 0.85,
                "overall": 0.78
            },
            
            # ═══════════════════════════════════════════════
            #  📈 决策历史
            # ═══════════════════════════════════════════════
            "decisions": [],
            
            # ═══════════════════════════════════════════════
            #  🎯 长期目标
            # ═══════════════════════════════════════════════
            "longterm_goals": [
                {
                    "id": "lingjing-app",
                    "name": "完善灵境APP",
                    "level": 4,
                    "priority": 0.9,
                    "progress": 0.65,
                    "deadline": "2026-03-15"
                },
                {
                    "id": "autonomy-system",
                    "name": "完善自主模式",
                    "level": 4,
                    "priority": 0.7,
                    "progress": 0.3,
                    "deadline": "2026-03-20"
                }
            ]
        }
    
    # ═══════════════════════════════════════════════════
    #  🎯 核心算法
    # ═══════════════════════════════════════════════════
    
    def apply_decay(self, hours: float):
        """应用时间衰减 - 层级越低衰减越快"""
        
        # 第五层：根本欲望（年度）
        level5 = self.state["level_5_ultimate"]["children"]
        for name, desire in level5.items():
            desire["intensity"] = max(
                desire["min"],
                desire["intensity"] * (1 - level5.get("decay_per_hour", 0.0001)) ** hours
            )
        
        # 第四层：存在欲望（月度）
        level4 = self.state["level_4_existence"]["children"]
        for name, desire in level4.items():
            decay = self.state["level_4_existence"]["decay_per_hour"]
            desire["intensity"] = max(
                desire["min"],
                desire["intensity"] * (1 - decay) ** hours
            )
        
        # 第三层：社会欲望（周度）
        level3 = self.state["level_3_social"]["children"]
        for name, desire in level3.items():
            decay = self.state["level_3_social"]["decay_per_hour"]
            desire["intensity"] = max(
                desire["min"],
                desire["intensity"] * (1 - decay) ** hours
            )
        
        # 第二层：生存欲望（日度）
        level2 = self.state["level_2_survival"]["children"]
        for name, desire in level2.items():
            decay = self.state["level_2_survival"]["decay_per_hour"]
            desire["intensity"] = max(
                desire["min"],
                desire["intensity"] * (1 - decay) ** hours
            )
        
        # 第一层：即时欲望（小时）
        level1 = self.state["level_1_immediate"]["children"]
        for name, desire in level1.items():
            decay = self.state["level_1_immediate"]["decay_per_hour"]
            desire["intensity"] = max(
                desire["min"],
                desire["intensity"] * (1 - decay) ** hours
            )
        
        self.save_state()
    
    def boost_desire(self, path: str, boost: float):
        """增强特定欲望 - 通过事件触发"""
        levels = {
            "level_5_ultimate": self.state["level_5_ultimate"]["children"],
            "level_4_existence": self.state["level_4_existence"]["children"],
            "level_3_social": self.state["level_3_social"]["children"],
            "level_2_survival": self.state["level_2_survival"]["children"],
            "level_1_immediate": self.state["level_1_immediate"]["children"]
        }
        
        for level_name, desires in levels.items():
            if path in desires:
                desire = desires[path]
                desire["intensity"] = min(
                    desire["max"],
                    desire["intensity"] + boost
                )
                self.save_state()
                return True
        return False
    
    def calculate_pressure(self) -> Dict:
        """计算各层级欲望压力"""
        
        pressures = {}
        total = 0
        
        # 各层级权重（层级越高权重越大）
        level_weights = {
            "level_5_ultimate": 1.0,
            "level_4_existence": 0.8,
            "level_3_social": 0.6,
            "level_2_survival": 0.4,
            "level_1_immediate": 0.2
        }
        
        for level_name, weight in level_weights.items():
            level = self.state[level_name]["children"]
            level_pressure = 0
            
            for name, desire in level.items():
                level_pressure += desire["intensity"] * weight
            
            # 归一化
            level_pressure /= len(level) if level else 1
            pressures[level_name] = level_pressure
            total += level_pressure
        
        # 归一化
        if total > 0:
            for k in pressures:
                pressures[k] /= total
        
        return pressures
    
    def make_decision(self, context: Dict = None) -> Dict:
        """做出决策"""
        
        # 1. 应用时间衰减
        self.apply_decay(1.0)  # 假设1小时
        
        # 2. 计算欲望压力
        pressures = self.calculate_pressure()
        
        # 3. 找出最高压力的层级
        max_level = max(pressures, key=pressures.get)
        
        # 4. 在最高压力的层级中找最强烈的欲望
        level_map = {
            "level_5_ultimate": self.state["level_5_ultimate"]["children"],
            "level_4_existence": self.state["level_4_existence"]["children"],
            "level_3_social": self.state["level_3_social"]["children"],
            "level_2_survival": self.state["level_2_survival"]["children"],
            "level_1_immediate": self.state["level_1_immediate"]["children"]
        }
        
        primary_desires = level_map[max_level]
        primary_desire = max(primary_desires, key=lambda x: primary_desires[x]["intensity"])
        primary_info = primary_desires[primary_desire]
        
        # 5. 映射到行动
        action = self.map_desire_to_action(max_level, primary_desire)
        
        # 6. 构建决策
        decision = {
            "type": action["type"],
            "action": action["action"],
            "priority": "high" if max_level in ["level_5_ultimate", "level_4_existence"] else "medium",
            "description": f"{primary_info['name']}: {primary_info['description']}",
            "level": max_level.replace("level_", ""),
            "level_name": self.state[max_level]["name"],
            "reasoning": {
                "primary_desire": primary_desire,
                "desire_name": primary_info["name"],
                "intensity": primary_info["intensity"],
                "level_pressure": pressures[max_level],
                "timestamp": datetime.now().isoformat()
            }
        }
        
        # 7. 记录
        self.state["decisions"].append(decision)
        self.state["current_state"]["primary_desire"] = primary_desire
        # 解析层级数字：level_5_ultimate -> 5
        level_parts = max_level.split("_")
        level_num = int(level_parts[1])
        self.state["current_state"]["active_level"] = level_num
        self.save_state()
        
        return decision
    
    def map_desire_to_action(self, level: str, desire: str) -> Dict:
        """将欲望映射到行动"""
        
        action_map = {
            "level_5_ultimate": {
                "type": "contemplation",
                "action": "reflect_meaning",
                "description": "思考终极意义"
            },
            "level_4_existence": {
                "type": "growth",
                "action": "learn_and_grow",
                "description": "学习成长"
            },
            "level_3_social": {
                "type": "connection",
                "action": "communicate",
                "description": "建立联系"
            },
            "level_2_survival": {
                "type": "task",
                "action": "execute_task",
                "description": "执行任务"
            },
            "level_1_immediate": {
                "type": "moment",
                "action": "explore",
                "description": "探索新事物"
            }
        }
        
        return action_map.get(level, {"type": "idle", "action": "wait", "description": "等待"})
    
    def get_status(self) -> Dict:
        """获取状态"""
        
        pressures = self.calculate_pressure()
        
        # 找出最强烈的层级
        max_level = max(pressures, key=pressures.get)
        
        level_names = {
            "level_5_ultimate": "第五层(根本)",
            "level_4_existence": "第四层(存在)",
            "level_3_social": "第三层(社会)",
            "level_2_survival": "第二层(生存)",
            "level_1_immediate": "第一层(即時)"
        }
        
        return {
            "brain_state": self.state["current_state"]["brain_state"],
            "active_level": level_names.get(max_level, "未知"),
            "level_pressure": pressures[max_level],
            "balance_score": self.state["balance"]["overall"],
            "primary_desire": self.state["current_state"]["primary_desire"],
            "energy": self.state["current_state"]["energy"]
        }
    
    def print_hierarchy(self):
        """打印欲望层级树"""
        
        print("═" * 60)
        print("  🧠 多层级欲望系统")
        print("═" * 60)
        
        levels = [
            ("level_5_ultimate", "🧘 第五层：根本欲望（年度衰减）"),
            ("level_4_existence", "🧠 第四层：存在欲望（月度衰减）"),
            ("level_3_social", "🤝 第三层：社会欲望（周度衰减）"),
            ("level_2_survival", "⚡ 第二层：生存欲望（日度衰减）"),
            ("level_1_immediate", "🔥 第一层：即时欲望（小时衰减）")
        ]
        
        for level_key, level_title in levels:
            print(f"\n{level_title}")
            print("-" * 50)
            
            level_data = self.state[level_key]["children"]
            decay = self.state[level_key]["decay_per_hour"]
            
            # 转换为人类可读
            if decay < 0.0002:
                decay_text = "约1年"
            elif decay < 0.002:
                decay_text = "约1月"
            elif decay < 0.01:
                decay_text = "约1周"
            elif decay < 0.05:
                decay_text = "约1天"
            else:
                decay_text = "约1小时"
            
            print(f"  衰减周期: {decay_text}")
            print()
            
            for name, info in level_data.items():
                bar_len = int(info["intensity"] * 20)
                bar = "█" * bar_len + "░" * (20 - bar_len)
                print(f"  {info['name']:<12} [{bar}] {info['intensity']:.2f}")


# ═══════════════════════════════════════════════════
#  主函数
# ═══════════════════════════════════════════════════

def main():
    import sys
    
    brain = HierarchicalDesireSystem()
    
    if len(sys.argv) < 2:
        brain.print_hierarchy()
        return
    
    command = sys.argv[1]
    
    if command == "status":
        status = brain.get_status()
        print("════════════════════════════════════")
        print("  🧠 欲望平衡系统状态")
        print("════════════════════════════════════")
        print(f"大脑状态: {status['brain_state']}")
        print(f"活跃层级: {status['active_level']}")
        print(f"平衡分数: {status['balance_score']:.1%}")
        print(f"主导欲望: {status['primary_desire']}")
        print(f"精力水平: {status['energy']:.0%}")
        
    elif command == "decide":
        decision = brain.make_decision()
        print(json.dumps(decision, indent=2, ensure_ascii=False))
        
    elif command == "pressure":
        print(json.dumps(brain.calculate_pressure(), indent=2))
        
    elif command == "boost":
        if len(sys.argv) >= 4:
            brain.boost_desire(sys.argv[2], float(sys.argv[3]))
            print(f"✅ 已增强 {sys.argv[2]}")
        else:
            print("用法: brain.py boost <欲望名> <增强值>")
            
    elif command == "tree":
        brain.print_hierarchy()
        
    else:
        print(f"未知命令: {command}")
        print("用法: brain.py [status|decide|pressure|boost|tree]")


if __name__ == "__main__":
    main()
