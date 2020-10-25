#!/usr/bin/env gjs

imports.gi.versions.GObject = "3.0";
imports.gi.versions.Clutter = "1.0";
imports.gi.versions.St = "1.0";

const {GObject, Clutter, St, Pango, PangoCairo} = imports.gi;
const Cairo = imports.cairo;

var PieChart = GObject.registerClass(
    class PieChart extends Clutter.Actor{
        _init(width, height, percentage, warning=30, danger=10,
              normalColor=null, warningColor=null, dangerColor=null){
            super._init();
            this._width = width;
            this._height = height;
            this._percentage = percentage;
            this._warning = warning;
            this._danger = danger;
            if(normalColor == null){
                this._normalColor = new Clutter.Color({
                    red: 0,
                    blue: 0,
                    green: 255,
                    alpha: 255
                });
            }else{
                this._normalColor = normalColor;
            }
            if(warningColor == null){
                this._warningColor = new Clutter.Color({
                    red: 255,
                    blue: 0,
                    green: 255,
                    alpha: 255
                });
            }else{
                this._warningColor = warningColor;
            }
            if(dangerColor == null){
                this._dangerColor = new Clutter.Color({
                    red: 255,
                    blue: 0,
                    green: 0,
                    alpha: 255
                });
            }else{
                this._dangerColor = dangerColor;
            }
            this._canvas = new Clutter.Canvas();
            this._canvas.set_size(width, height);
            this._canvas.connect('draw', (canvas, cr, width, height)=>{
                this._draw(canvas, cr, width, height);
            });
            this.redraw();
            this.set_content(this._canvas);
            this.set_size(width, height);
        }

        setWidth(width){
            this._width = width;
        }
        setHeight(height){
            this._height = height;
        }

        setPercentage(percentage){
            this._percentage = percentage;
        }
        getPercentage(){
            return this._percentage;
        }

        setWarning(warning){
            this._warning = warning;
        }

        setDanger(danger){
            this._danger = danger;
        }

        setNormalColor(normalColor){
            this._normalColor = normalColor;
        }

        setWarningColor(warningColor){
            this._warningColor = warningColor;
        }

        setDangerColor(dangerColor){
            this._dangerColor = dangerColor;
        }

        redraw(){
            this._canvas.invalidate();
        }

        _draw(canvas, cr, width, height){
            cr.save();
            Clutter.cairo_set_source_color(cr, new Clutter.Color({
                red: 70, 
                blue: 70,
                green: 70,
                alpha: 255
            }));
            cr.rectangle(0, 0, width, height);
            cr.fill();
            cr.restore();
            // Begin to paint
            cr.save();
            let linew = width * 0.15;
            cr.setLineWidth(linew);
            Clutter.cairo_set_source_color(cr, new Clutter.Color({
                red: 80, 
                blue: 80,
                green: 80,
                alpha: 255
            }));
            cr.arc((width) / 2,
                   (height) / 2,
                   parseInt((width - linew) / 2 * 0.8),
                   0.00001, 0);
            cr.stroke();
            cr.restore();
            cr.save();
            cr.setLineWidth(linew);
            if(this._percentage < this._danger){
                Clutter.cairo_set_source_color(cr, this._dangerColor);
            }else if(this._percentage < this._warning){
                Clutter.cairo_set_source_color(cr, this._warningColor);
            }else{
                Clutter.cairo_set_source_color(cr, this._normalColor);
            }
            cr.arc((width) / 2,
                   (height) / 2,
                   parseInt((width - linew) / 2 * 0.8),
                   Math.PI * 2* (1 - this._percentage / 100), 0);
            cr.stroke();
            cr.restore();

            cr.save();
            Clutter.cairo_set_source_color(
                cr,
                new Clutter.Color({
                red: 255, 
                blue: 255,
                green: 255,
                alpha: 255
                }));
            let texttoshow = this._percentage.toString() + "%";
            this._write_centered_text(cr, width/2, height/2, texttoshow,
                                      'Ubuntu', '10');
            cr.restore();
        }

        _write_centered_text(cr, x, y, text, font, size){
            let pg_layout = PangoCairo.create_layout(cr);
            let pg_context = pg_layout.get_context();
            pg_layout.set_font_description(
                Pango.FontDescription.from_string('%s %s'.format(font, size)));
            pg_layout.set_text(text, -1);

            PangoCairo.update_layout(cr, pg_layout);
            let text_size = pg_layout.get_pixel_size();

            cr.moveTo(x - text_size[0]/2, y + text_size[1]/4);
            cr.setFontSize(size);
            cr.showText(text);
        }
    }
);