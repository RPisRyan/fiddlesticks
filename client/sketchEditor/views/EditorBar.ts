namespace SketchEditor {

    export class EditorBar extends Component<AppState> {

        store: Store;

        constructor(container: HTMLElement, store: Store) {
            super();

            this.store = store;

            const sketchDom$ = store.events.merge(
                store.events.sketch.loaded,
                store.events.sketch.attrChanged,
                store.events.designer.userMessageChanged)
                .map(m => this.render(store.state));
            ReactiveDom.renderStream(sketchDom$, container);

        }

        render(state: AppState) {
            const sketch = state.sketch;
            const self = this;

            return h("div", [
                h("label", "Add text: "),
                h("input.add-text", {
                    on: {
                        keypress: (ev) => {
                            if ((ev.which || ev.keyCode) === DomHelpers.KeyCodes.Enter) {
                                const text = ev.target && ev.target.value;
                                if (text.length) {
                                    this.store.actions.textBlock.add.dispatch({ text: text });
                                    ev.target.value = '';
                                }
                            }
                        }
                    },
                    attrs: {
                        type: "text",
                    },
                    props: {
                        placeholder: "Press [Enter] to add"
                    },
                    style: {
                    }
                }),

                h("label", "Background: "),
                h("input.background-color",
                    {
                        props: {
                            type: "text",
                            value: sketch.backgroundColor
                        },
                        hook: {
                            insert: (vnode) =>
                                ColorPicker.setup(
                                    vnode.elm,
                                    SketchHelpers.colorsInUse(this.store.state.sketch),
                                    color => {
                                        this.store.actions.sketch.attrUpdate.dispatch(
                                            { backgroundColor: color && color.toHexString() });
                                    }
                                ),
                            update: (oldVnode, vnode) => {
                                ColorPicker.set(vnode.elm, sketch.backgroundColor);
                            },
                            destroy: (vnode) => ColorPicker.destroy(vnode.elm)
                        }
                    }),

                BootScript.dropdown({
                    id: "sketchMenu",
                    content: "Actions",
                    items: [
                        {
                            content: "New",
                            options: {
                                attrs: {
                                    title: "Create new sketch"
                                },
                                on: {
                                    click: () => this.store.actions.sketch.create.dispatch()
                                }
                            }
                        },
                        {
                            content: "Zoom to fit",
                            options: {
                                attrs: {
                                    title: "Fit contents in view"
                                },
                                on: {
                                    click: () => this.store.actions.designer.zoomToFit.dispatch()
                                }
                            }
                        },
                        {
                            content: "Export image",
                            options: {
                                attrs: {
                                    title: "Export Fiddle as PNG",
                                },
                                on: {
                                    click: () => this.store.actions.designer.exportPNG.dispatch()
                                }
                            }
                        },
                        {
                            content: "Export SVG",
                            options: {
                                attrs: {
                                    title: "Export Fiddle as vector graphics"
                                },
                                on: {
                                    click: () => this.store.actions.designer.exportSVG.dispatch()
                                }
                            }
                        },
                        {
                            content: "Duplicate sketch",
                            options: {
                                attrs: {
                                    title: "Copy contents into new sketch"
                                },
                                on: {
                                    click: () => this.store.actions.sketch.clone.dispatch()
                                }
                            }
                        },
                    ]
                }),



                h("div#rightSide",
                    {},
                    [
                        h("div#user-message", {}, [state.userMessage || ""]),

                        h("div#show-help.glyphicon.glyphicon-question-sign",
                            {
                                on: {
                                    click: () => {
                                        this.store.actions.designer.toggleHelp.dispatch();
                                    }
                                }
                            }),
                    ])

            ]
            );
        }
    }

}