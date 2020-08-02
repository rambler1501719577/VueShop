<template>
  <div class="add-container">
    <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
    <el-form :model="goodsForm" ref="goodsFormRef" label-position="top">
      <el-steps :space="200" :active="step" finish-status="success" align-center>
        <!-- 第一步 -->
        <el-step title="基本信息">
          <template slot="description" v-if="isCurrent(0)">
            <div class="step-container">
              <div class="content">
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="goodsForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                  <el-input v-model="goodsForm.price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="weight">
                  <el-input v-model="goodsForm.weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="num">
                  <el-input v-model="goodsForm.num" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="classifyId">
                  <el-cascader
                    clearable
                    v-model="selectedKeys"
                    :options="options"
                    :props="{ expandTrigger: 'hover', value: 'name', children: 'children', label: 'name' }"
                    @change="getParentId"
                  ></el-cascader>
                </el-form-item>
              </div>
              <el-button type="primary" @click="finishStep1">下一步</el-button>
            </div>
          </template>
        </el-step>
        <!-- 第二步 -->
        <el-step title="商品参数">
          <template slot="description" v-if="isCurrent(1)">
            <div class="step-container">
              <div class="content">
                <el-form-item v-for="(item,index) of dynamicData" :key="index" :label="item.name">
                  <el-checkbox-group v-model="item.value">
                    <el-checkbox border :label="cb" v-for="(cb,i) of item.value" :key="i"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="jumper">
                <el-button type="primary" @click="step--">上一步</el-button>
                <el-button type="primary" @click="finishStep2">下一步</el-button>
              </div>
            </div>
          </template>
        </el-step>
        <!-- 第三步 -->
        <el-step title="商品属性">
          <template slot="description" v-if="isCurrent(2)">
            <div class="step-container">
              <div class="content">
                <el-form-item
                  :label="staticItem.name"
                  v-for="(staticItem,index) of staticParam"
                  :key="index"
                >
                  <el-input :disabled="true" v-model="staticItem.value[0]"></el-input>
                </el-form-item>
              </div>
              <div class="jumper">
                <el-button type="primary" @click="step--">上一步</el-button>
                <el-button type="primary" @click="step++">下一步</el-button>
              </div>
            </div>
          </template>
        </el-step>
        <!-- 第四步 -->
        <el-step title="商品图片">
          <template slot="description" v-if="isCurrent(3)">
            <div class="step-container">
              <div class="content">
                <el-upload
                  class="upload-demo"
                  action
                  :auto-upload="false"
                  :file-list="fileList"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </div>
              <div class="jumper">
                <el-button type="primary" @click="step--">上一步</el-button>
                <el-button type="primary" @click="step++">下一步</el-button>
              </div>
            </div>
          </template>
        </el-step>
        <el-step title="商品内容">
          <template slot="description" v-if="isCurrent(4)">
            <div class="step-container">
              <div class="content">
                <quillEditor v-model="goodsForm.content"></quillEditor>
              </div>
              <div class="jumper">
                <el-button type="primary" @click="step--">上一步</el-button>
                <el-button type="primary" @click="submitGoods">添加商品</el-button>
              </div>
            </div>
          </template>
        </el-step>
        <el-step title="完成">
          <template slot="description" v-if="isCurrent(5)">
            <div class="step-container">666</div>
          </template>
        </el-step>
      </el-steps>
    </el-form>
  </div>
</template>
<script>
import _ from 'lodash'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import '@/mock/goods'
import settings from '@/settings'
import {
    goodsList,
    addGoods,
    deleteGoods,
    updateGoods,
    goodsDetail,
} from '@/api/goods'
import '@/mock/category'
import { categoryList, classifyParam } from '@/api/category'
export default {
    name: 'add',
    data() {
        return {
            step: 0, // 当前在第几步
            goodsForm: {
                name: '',
                price: 0,
                weight: 0,
                num: 0,
                classifyId: '',
                imgSrc: '',
                content: '',
            },
            fileList: [],
            selectedKeys: [], //级联选择框绑定数据
            options: [],
            goodsFormRules: {
                name: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '商品名称不能为空',
                    },
                ],
            },
            dynamicData: [], //商品参数(动态)
            staticParam: [], // 商品属性(静态)
        }
    },
    components: {
        quillEditor,
    },
    methods: {
        // 判断展示第几步的内容
        isCurrent: function (current) {
            return this.step == current
        },
        // 获取商品分类列表
        getCateList: async function () {
            const { code, data } = await categoryList()
            this.options = data.records
        },
        // 级联选择框选中处理函数
        getParentId: function (value) {
            this.goodsForm.classifyId = value[value.length - 1]
        },
        // 跳转第二步
        finishStep1: async function () {
            if (this.goodsForm.name != '' && this.goodsForm.classifyId != '') {
                const { code, data } = await classifyParam()
                if (code != 200) {
                    return this.$message.error('获取商品参数失败')
                }
                this.dynamicData = data
                this.step++
            } else {
                return this.$message.error('商品名称或者商品分类没有选择')
            }
        },
        // 跳转第三步
        finishStep2: async function () {
            const { code, data } = await classifyParam()
            if (code != 200) {
                return this.$message.error('获取商品参数失败')
            }
            this.staticParam = data
            this.step++
        },
        submitGoods: async function () {
            const form = _.cloneDeep(this.goodsForm)
            form.attribute = []
            this.dynamicData.forEach((item) => {
                form.attribute.push({
                    id: item.id,
                    value: item.value.join(','),
                })
            })
            this.staticParam.forEach((item) => {
                form.attribute.push({
                    id: item.id,
                    value: item.value.join(','),
                })
            })
            const { code, data } = await addGoods(form)
            if (code === 200) {
                this.$message.success('新增商品成功')
                this.step++
            } else {
                this.$message.error('新增商品失败,请稍后重试')
            }
        },
    },
    created() {
        this.getCateList()
    },
}
</script>
<style scoped lang="stylus">
.add-container {
    .el-form {
        .el-steps {
            margin-top: 15px;
            position: relative;
        }

        .step-container {
            left: 0;
            top: 65px;
            position: absolute;
            width: calc(100vw - 230px - 160px);
            margin: 0 0 15px 40px;
            padding-top: 15px;
            text-align: left !important;

            .el-button {
                float: right;
            }

            .jumper {
                margin-top: 15px;
                display: flex;
                justify-content: space-between;
            }

            .content {
                min-height: calc(100vh - 360px);

                .btn-add {
                    margin-bottom: 15px;
                }
            }

            .el-checkbox {
                margin: 0 10px 0 0;
            }
        }
    }
}
</style>
