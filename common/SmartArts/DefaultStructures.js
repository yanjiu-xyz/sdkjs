/*
 * (c) Copyright Ascensio System SIA 2010-2023
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function (window) {
	const g_clr_accent1 = 0;
	const g_clr_lt1 = 0;
	const g_clr_tx1 = 0;
	const g_clr_dk1 = 0;



	const defaultLayout = {
		sampData: {
			dataModel: {
				ptLst: [
					{
						id: "0",
						type: AscFormat.Point_type_doc
					},
					{
						id: "1",
						prSet: {
							phldr: true
						}
					},
					{
						id: "2",
						prSet: {
							phldr: true
						}
					},
					{
						id: "3",
						prSet: {
							phldr: true
						}
					},
					{
						id: "4",
						prSet: {
							phldr: true
						}
					},
					{
						id: "5",
						prSet: {
							phldr: true
						}
					}
				],
				cxnLst: [
					{
						modelId: "6",
						srcId: "0",
						destId: "1",
						srcOrd: "0",
						destOrd: "0"
					},
					{
						modelId: "7",
						srcId: "0",
						destId: "2",
						srcOrd: "1",
						destOrd: "0"
					},
					{
						modelId: "8",
						srcId: "0",
						destId: "3",
						srcOrd: "2",
						destOrd: "0"
					},
					{
						modelId: "9",
						srcId: "0",
						destId: "4",
						srcOrd: "3",
						destOrd: "0"
					},
					{
						modelId: "10",
						srcId: "0",
						destId: "5",
						srcOrd: "4",
						destOrd: "0"
					}
				],
				bg: {},
				whole: {}
			}
		},
		styleData: {
			dataModel: {
				ptLst: [
					{
						id: "0",
						type: AscFormat.Point_type_doc
					},
					{id: "1"},
					{id: "2"}
				],
				cxnLst: [
					{
						modelId: "3",
						srcId: "0",
						destId: "1",
						srcOrd: "0",
						destOrd: "0"
					},
					{
						modelId: "4",
						srcId: "0",
						destId: "2",
						srcOrd: "1",
						destOrd: "0"
					}
				],
				bg: {},
				whole: {}
			}
		},
		clrData: {
			dataModel: {
				ptLst: [
					{
						id: "0",
						type: AscFormat.Point_type_doc
					},
					{id: "1"},
					{id: "2"},
					{id: "3"},
					{id: "4"},
					{id: "5"},
					{id: "6"}
				],
				cxnLst: [
					{
						modelId: "7",
						srcId: "0",
						destId: "1",
						srcOrd: "0",
						destOrd: "0"
					},
					{
						modelId: "8",
						srcId: "0",
						destId: "2",
						srcOrd: "1",
						destOrd: "0"
					},
					{
						modelId: "9",
						srcId: "0",
						destId: "3",
						srcOrd: "2",
						destOrd: "0"
					},
					{
						modelId: "10",
						srcId: "0",
						destId: "4",
						srcOrd: "3",
						destOrd: "0"
					},
					{
						modelId: "11",
						srcId: "0",
						destId: "5",
						srcOrd: "4",
						destOrd: "0"
					},
					{
						modelId: "12",
						srcId: "0",
						destId: "6",
						srcOrd: "5",
						destOrd: "0"
					}
				],
				bg: {},
				whole: {}
			}
		},
		layoutNode: {
			name: "diagram",
			children: [
				{
					varLst: {
						dir: {},
						resizeHandles: {
							val: AscFormat.ResizeHandles_val_exact
						}
					}
				},
				{
					choose: {
						name: "Name0",
						layoutElse: {
							name: "Name2",
							children: [
								{
									alg: {
										type: AscFormat.Alg_type_snake,
										params: [
											{type: AscFormat.Param_type_grDir, val: "tR"},
											{type: AscFormat.Param_type_flowDir, val: "row"},
											{type: AscFormat.Param_type_contDir, val: "sameDir"},
											{type: AscFormat.Param_type_off, val: "ctr"}
										]
									}
								}
							]
						},
						ifArray: [{
							name: "Name1",
							func: AscFormat.If_func_var,
							arg: AscFormat.If_arg_dir,
							op: AscFormat.If_op_equ,
							val: "norm",
							children: [
								{
									alg: {
										type: AscFormat.Alg_type_snake,
										params: [
											{type: AscFormat.Param_type_grDir, val: "tL"},
											{type: AscFormat.Param_type_flowDir, val: "row"},
											{type: AscFormat.Param_type_contDir, val: "sameDir"},
											{type: AscFormat.Param_type_off, val: "ctr"}
										]
									}
								}
							]
						}]
					}
				},
				{
					shape: {
						blip: "",
						adjLst: []
					}
				},
				{
					presOf: {}
				},
				{
					constrLst:
						[
							{type:AscFormat.Constr_type_w, for: AscFormat.Constr_for_ch, forName: "node", refType: AscFormat.Constr_type_w},
							{type:AscFormat.Constr_type_h, for: AscFormat.Constr_for_ch, forName: "node", refType: AscFormat.Constr_type_w, refFor: AscFormat.Constr_for_ch, refForName: "node", fact: 0.6},
							{type:AscFormat.Constr_type_w, for: AscFormat.Constr_for_ch, forName: "sibTrans", refType: AscFormat.Constr_type_w, refFor: AscFormat.Constr_for_ch, refForName: "node", fact: 0.1},
							{type:AscFormat.Constr_type_sp, refType: AscFormat.Constr_type_w, refFor: AscFormat.Constr_for_ch, refForName: "sibTrans"},
							{type:AscFormat.Constr_type_primFontSz, for: AscFormat.Constr_for_ch, forName: "node", op: AscFormat.Constr_op_equ, val: 65}
					]
				},
				{ruleLst: {}},
				{
					forEach: {
						name: "Name3",
						axis: AscFormat.AxisType_value_ch,
						ptType: AscFormat.ElementType_value_node,
						children: [
							{
								layoutNode: {
									name: "node",
									children: [
										{
										varLst: {
											bulletEnabled: {
												val: true
											}
										}
										},
										{
											alg: {
												type: AscFormat.Alg_type_tx
											}
										},
										{
											shape: {
												type: AscFormat.LayoutShapeType_shapeType_rect,
												blip: "",
												adjLst: []

											}
										},
										{
											presOf: {
												axis: AscFormat.AxisType_value_desOrSelf,
												ptType: AscFormat.ElementType_value_node
											}
										},
										{
											constrLst: [
												{type: AscFormat.Constr_type_lMarg, refType: AscFormat.Constr_type_primFontSz, fact: 0.3},
												{type: AscFormat.Constr_type_rMarg, refType: AscFormat.Constr_type_primFontSz, fact: 0.3},
												{type: AscFormat.Constr_type_tMarg, refType: AscFormat.Constr_type_primFontSz, fact: 0.3},
												{type: AscFormat.Constr_type_bMarg, refType: AscFormat.Constr_type_primFontSz, fact: 0.3}
											]
										},
										{
											ruleLst: [
												{
													type: AscFormat.Constr_type_primFontSz,
													val: 5,
													fact: NaN,
													max: NaN
												}
											]
										}
									]
								}
							},
							{
								forEach: {
									name: "Name4",
									axis: AscFormat.AxisType_value_followSib,
									ptType: AscFormat.ElementType_value_sibTrans,
									cnt: 1,
									children: [
										{
											layoutNode: {
												name: "sibTrans",
												children: [
													{
														alg: {
															type: AscFormat.Alg_type_sp
														}
													},
													{
														shape: {
															adjLst: [],
															blip: ""
														}
													},
													{
														presOf: {}
													},
													{
														constrLst: []
													},
													{
														ruleLst: []
													}
												]
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	};
	function layoutNode(name) {
		const node = new AscFormat.LayoutNode();
		node.setName(name);
		return node;
	}
	function choose(ifArray, elseChoose) {
		
	}
	function createIf() {
		
	}
	function generateSampData(data) {
		const sampData = new AscFormat.SampData();
		if (data.dataModel) {
			const dataModel = new AscFormat.DataModel();
			if (data.dataModel.ptLst) {
				const ptLst = new AscFormat.PtLst();
				for (let i = 0; i < data.dataModel.ptLst.length; i++) {
					const sampPt = data.dataModel.ptLst[i];
					const pt = new AscFormat.Point();
					pt.setModelId(sampPt.id);
					if (sampPt.prSet) {
						pt.setPrSet(new AscFormat.PrSet());
						if (sampPt.prSet.phldr) {
							pt.prSet.setPhldr(sampPt.prSet.phldr);
						}
					}

					ptLst.addToLst(ptLst.list.length, pt);

				}
				dataModel.setPtLst(ptLst);
			}

			if (data.dataModel.cxnLst) {
				const cxnLst = new AscFormat.CxnLst();
				for (let i = 0; i < data.dataModel.cxnLst.length; i += 1) {
					const sampCxn = data.dataModel.cxnLst[i];
					const cxn = new AscFormat.Cxn();
					cxn.setModelId(sampCxn.modelId);
					cxn.setDestId(sampCxn.destId);
					cxn.setDestOrd(sampCxn.destOrd);
					cxn.setSrcId(sampCxn.srcId);
					cxn.setSrcOrd(sampCxn.srcOrd);
					cxnLst.addToLst(cxnLst.list.length, cxn);
				}
				dataModel.setCxnLst(cxnLst);
			}
			sampData.setDataModel(dataModel);
		}
	}
	function generateDefaultLayout() {

	}
	
	function param() {
		
	}
	
	function constr() {
		
	}

	const defaultStylesInfo = [
		{
			names: ["fgImgPlace1", "alignImgPlace1", "bgImgPlace1", "callout",
				"fgAcc1", "conFgAcc1", "alignAcc1", "bgAcc1", "solidFgAcc1",
				"solidAlignAcc1", "solidBgAcc1", "fgAccFollowNode1", "alignAccFollowNode1", "bgAccFollowNode1", "fgAcc0", "fgAcc2",
				"fgAcc3", "fgAcc4", "fgShp"],
			idx: [2, 1, 0]
		},
		{
			names: ["revTx"],
			idx: [0, 0, 0]
		},
		{
			names: ["bgShp", "dkBgShp", "trBgShp"],
			idx: [0, 1, 0]
		},
		{
			names: ["trAlignAcc1"],
			idx: [1, 1, 0]
		},
		{
			names: ["parChTrans1D1", "parChTrans1D2", "parChTrans1D3", "parChTrans1D4"],
			idx: [2, 0, 0]
		},
		{
			names: ["sibTrans1D1"],
			idx: [1, 0, 0]
		},
		{
			names: ["node0", "lnNode1", "alignNode1", "node1", "node2", "node3", "node4", "sibTrans2D1",
				"asst0", "asst1", "asst2", "asst3", "asst4", "parChTrans2D1", "parChTrans2D2", "parChTrans2D3", "parChTrans2D4"],
			clr: {type: g_clr_lt1},
			idx: [2, 1, 0]
		},
		{
			names: ["sibTrans2D1", "fgSibTrans2D1", "bgSibTrans2D1"],
			clr: {type: g_clr_lt1},
			idx: [0, 1, 0]
		},
		{
			names: ["vennNode1"],
			clr: {type: g_clr_tx1},
			idx: [2, 1, 0]
		}
	];
	function generateDefaultStyles() {
		const styleDef = new AscFormat.StyleDef();
		styleDef.setUniqueId("urn:microsoft.com/office/officeart/2005/8/quickstyle/simple1");
		styleDef.setTitle(new AscFormat.DiagramTitle());
		styleDef.setDesc(new AscFormat.DiagramTitle());
		styleDef.setCatLst(new AscFormat.CatLst());
		const cat = new AscFormat.SCat();
		cat.setType("simple");
		cat.setPri(10100);
		styleDef.catLst.addToLst(0, cat);
		styleDef.setScene3d(generateScene3d());
		for (let i = 0; i < defaultStylesInfo.length; i++) {
			const info = defaultStylesInfo[i];
			const color = info.clr;
			const idx = info.idx;
			for (let j = 0; j < info.names.length; j++) {
				styleDef.addToLstStyleLbl(styleDef.styleLbl.length, generateStyleStyleLbl(info.names[j], color, idx));
			}
		}
	}
	function generateScene3d() {
		const scene3d = new AscFormat.Scene3d();
		scene3d.setCamera(new AscFormat.Camera());
		scene3d.camera.setPrst(AscFormat.Camera_prst_orthographicFront);
		scene3d.setLightRig(new AscFormat.LightRig());
		scene3d.lightRig.setRig(AscFormat.LightRig_rig_threePt);
		scene3d.lightRig.setDir(AscFormat.LightRig_dir_t);
		return scene3d;
	}
	function generateStyleStyleLbl(name, color, idx) {
		const styleLbl = new AscFormat.StyleDefStyleLbl();
		styleLbl.setName(name);
		styleLbl.setScene3d(generateScene3d());
		styleLbl.setSp3d(new AscFormat.Sp3d());
		styleLbl.setTxPr(new AscFormat.CTextBody());
		styleLbl.setStyle(new AscFormat.CShapeStyle());
		styleLbl.style.setLnRef(new AscFormat.StyleRef());
		styleLbl.style.lnRef.setIdx(idx[0]);
		styleLbl.style.setFillRef(new AscFormat.StyleRef());
		styleLbl.style.fillRef.setIdx(idx[1]);
		styleLbl.style.setEffectRef(new AscFormat.StyleRef());
		styleLbl.style.effectRef.setIdx(idx[2]);
		styleLbl.style.setFontRef(new AscFormat.FontRef());
		styleLbl.style.fontRef.setIdx(AscFormat.fntStyleInd_minor);
		if (color) {
			const unicolor = AscFormat.CreateSchemeUnicolorWithMods(color.type, color.mods);
			unicolor.setColor(new AscFormat.CSchemeColor());
			unicolor.color.setId(g_clr_lt1);
			styleLbl.style.fontRef.setColor(unicolor);
		}
		return styleLbl;
	}


	function tint(val) {
		return {name: "tint", val: val};
	}
	function alpha(val) {
		return {name: "alpha", val: val};
	}
	function shade(val) {
		return {name: "shade", val: val};
	}
	function repeatAccent(mods) {
		return {
			method: AscFormat.ClrLst_meth_repeat,
			colors: [{type: g_clr_accent1, mods: mods}]
		};
	}
	function repeatLt(mods) {
		return {
			method: AscFormat.ClrLst_meth_repeat,
			colors: [{type: g_clr_lt1, mods: mods}]
		};
	}
	function repeatTx(mods) {
		return {
			method: AscFormat.ClrLst_meth_repeat,
			colors: [{type: g_clr_tx1, mods: mods}]
		};
	}
	function repeatDk(mods) {
		return {
			method: AscFormat.ClrLst_meth_repeat,
			colors: [{type: g_clr_dk1, mods: mods}]
		};
	}
	function repeatAccentTint(val) {
		return repeatAccent([tint(val)]);
	}
	function repeatAccentAlpha(val) {
		return repeatAccent([alpha(val)]);
	}
	function repeatAccentShade(val) {
		return repeatAccent([shade(val)]);
	}
	function repeatLtTint(val) {
		return repeatLt([tint(val)]);
	}
	function repeatLtAlpha(val) {
		return repeatLt([alpha(val)]);
	}
	function repeatLtShade(val) {
		return repeatLt([shade(val)]);
	}
	function generateDefaultColors() {
		const colors = new AscFormat.ColorsDef();
		colors.setUniqueId("urn:microsoft.com/office/officeart/2005/8/colors/accent1_2");
		colors.setCatLst(new AscFormat.CatLst());
		const cat = new AscFormat.SCat();
		colors.catLst.addToLst(cat);
		cat.setType("accent1");
		cat.setPri(11200);
		const presetStyleLbl = [
			{
				names:["node0", "node1", "lnNode1", "node2", "node3", "node4", "asst0", "asst1", "asst2", "asst3", "asst4"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatLt()
				}
			},
			{
				names:["alignNode1"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccent()
				}
			},
			{
				names:["vennNode1"],
				clrsLst: {
					fillClrLst: repeatAccentAlpha(50000),
					linClrLst: repeatLt()
				}
			},
			{
				names:["fgImgPlace1", "alignImgPlace1", "bgImgPlace1"],
				clrsLst: {
					fillClrLst: repeatAccentTint(50000),
					linClrLst: repeatLt(),
					txFillClrLst: repeatLt()
				}
			},
			{
				names:["sibTrans2D1", "fgSibTrans2D1", "bgSibTrans2D1"],
				clrsLst: {
					fillClrLst: repeatAccentTint(60000),
					linClrLst: repeatAccentTint(60000),
				}
			},
			{
				names:["sibTrans1D1"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatTx(),
				}
			},
			{
				names:["callout"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccentTint(50000),
					txFillClrLst: repeatTx(),
				}
			},
			{
				names:["parChTrans2D1"],
				clrsLst: {
					fillClrLst: repeatAccentTint(60000),
					linClrLst: repeatAccentTint(60000),
					txFillClrLst: repeatLt()
				}
			},
			{
				names:["parChTrans2D2", "parChTrans2D3", "parChTrans2D4"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatLt()
				}
			},
			{
				names:["parChTrans1D1", "parChTrans1D2"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccentShade(60000),
					txFillClrLst: repeatTx()
				}
			},
			{
				names:["parChTrans1D3", "parChTrans1D4"],
				clrsLst: {
					fillClrLst: repeatAccent(),
					linClrLst: repeatAccentShade(80000),
					txFillClrLst: repeatTx()
				}
			},
			{
				names:["fgAcc1", "conFgAcc1", "alignAcc1", "bgAcc1", "fgAcc0", "fgAcc2", "fgAcc3", "fgAcc4"],
				clrsLst: {
					fillClrLst: repeatLtAlpha(90000),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatDk()
				}
			},
			{
				names:["trAlignAcc1"],
				clrsLst: {
					fillClrLst: repeatLtAlpha(40000),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatDk()
				}
			},
			{
				names:["solidFgAcc1", "solidAlignAcc1", "solidBgAcc1"],
				clrsLst: {
					fillClrLst: repeatLt(),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatDk()
				}
			},
			{
				names:["fgAccFollowNode1", "alignAccFollowNode1", "bgAccFollowNode1"],
				clrsLst: {
					fillClrLst: repeatAccent([alpha(90000), tint(40000)]),
					linClrLst: repeatAccent([alpha(90000), tint(40000)]),
					txFillClrLst: repeatDk()
				}
			},
			{
				names: ["bgShp"],
				clrsLst: {
					fillClrLst: repeatAccentTint(40000),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatDk()
				}
			},
			{
				names: ["dkBgShp"],
				clrsLst: {
					fillClrLst: repeatAccentShade(80000),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatLt()
				}
			},
			{
				names: ["trBgShp"],
				clrsLst: {
					fillClrLst: repeatAccent([tint(50000), alpha(40000)]),
					linClrLst: repeatAccent(),
					txFillClrLst: repeatLt()
				}
			},
			{
				names: ["fgShp"],
				clrsLst: {
					fillClrLst: repeatAccentTint(60000),
					linClrLst: repeatLt(),
					txFillClrLst: repeatDk()
				}
			},
			{
				names: ["revTx"],
				clrsLst: {
					fillClrLst: repeatLtAlpha(0),
					linClrLst: repeatDk([alpha(0)]),
					txFillClrLst: repeatTx()
				}
			}
		];
		for (let i = 0; i < presetStyleLbl.length; i++) {
			const infos = presetStyleLbl[i];
			const names = infos.names;
			for (let j = 0; j < names.length; j++) {
				const styleLbl = createColorsStyleLbl(presetStyleLbl[i].clrsLst, names[j]);
				colors.addToLstStyleLbl(colors.styleLbl.length, styleLbl);
			}
		}
	}
	function createColorsStyleLbl(clrsLst, name) {
		const styleLbl = new AscFormat.ColorDefStyleLbl();
		styleLbl.setName(name);
		styleLbl.setLinClrLst(new AscFormat.ClrLst());
		styleLbl.setFillClrLst(new AscFormat.ClrLst());
		styleLbl.setEffectClrLst(new AscFormat.ClrLst());
		styleLbl.setTxLinClrLst(new AscFormat.ClrLst());
		styleLbl.setTxFillClrLst(new AscFormat.ClrLst());
		styleLbl.setTxEffectClrLst(new AscFormat.ClrLst());
		fillColorsLst(styleLbl.fillClrLst, clrsLst.fillClrLst);
		fillColorsLst(styleLbl.linClrLst, clrsLst.linClrLst);
		fillColorsLst(styleLbl.effectClrLst, clrsLst.effectClrLst);
		fillColorsLst(styleLbl.txLinClrLst, clrsLst.txLinClrLst);
		fillColorsLst(styleLbl.txFillClrLst, clrsLst.txFillClrLst);
		fillColorsLst(styleLbl.txEffectClrLst, clrsLst.txEffectClrLst);
		return styleLbl;
	}
	function fillColorsLst(styleLblClrLst, exampleClrLst) {
		if (!exampleClrLst) {
			return;
		}
		const method = exampleClrLst.method;
		const colors = exampleClrLst.colors;
		styleLblClrLst.setMeth(method);
		for (let i = 0; i < colors.length; i++) {
			styleLblClrLst.addToLst(i, AscFormat.CreateSchemeUnicolorWithMods(colors[i].type, colors[i].mods));
		}
	}
})(window);
