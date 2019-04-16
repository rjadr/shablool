(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var c3r, d3r, frFmt, frFmtInt, frFmtPct, gcr, nf, r, tpl;
    nf = $.pivotUtilities.numberFormat;
    tpl = $.pivotUtilities.aggregatorTemplates;
    r = $.pivotUtilities.renderers;
    gcr = $.pivotUtilities.gchart_renderers;
    d3r = $.pivotUtilities.d3_renderers;
    c3r = $.pivotUtilities.c3_renderers;
    frFmt = nf({
      thousandsSep: ",",
      decimalSep: "."
    });
    frFmtInt = nf({
      digitsAfterDecimal: 0,
      thousandsSep: ",",
      decimalSep: "."
    });
    frFmtPct = nf({
      digitsAfterDecimal: 2,
      scaler: 100,
      suffix: "%",
      thousandsSep: ",",
      decimalSep: "."
    });
    $.pivotUtilities.locales.he = {
      localeStrings: {
        renderError: "An error occured while processing the- PivotTable.",
        computeError: "There was an error during the calculation of the PivotTable.",
        uiRenderError: "There was an error processing the PivotTable.",
        selectAll: "Select all",
        selectNone: "Select none",
        tooMany: "(Too many entries)",
        filterResults: "Filter results",
        totals: "Everything",
        vs: "of",
        by: "as per"
      },
      aggregators: {
        "Quantity": tpl.count(frFmtInt),
        "Number of unique values": tpl.countUnique(frFmtInt),
        "As list of unique values": tpl.listUnique(", "),
        "Amount": tpl.sum(frFmt),
        "Total amount": tpl.sum(frFmtInt),
        "Average": tpl.average(frFmt),
        "Minimum": tpl.min(frFmt),
        "Maximum": tpl.max(frFmt),
        "Amount on the sum": tpl.sumOverSum(frFmt),
        "80% over": tpl.sumOverSumBound80(true, frFmt),
        "80% under": tpl.sumOverSumBound80(false, frFmt),
        "Set of different sizes": tpl.fractionOf(tpl.sum(), "total", frFmtPct),
        "Sum as part of rows": tpl.fractionOf(tpl.sum(), "row", frFmtPct),
        "Set of hard drives": tpl.fractionOf(tpl.sum(), "col", frFmtPct),
        "Total quantity": tpl.fractionOf(tpl.count(), "total", frFmtPct),
        "Number of rows": tpl.fractionOf(tpl.count(), "row", frFmtPct),
        "Number of collumns": tpl.fractionOf(tpl.count(), "col", frFmtPct)
      },
      renderers: {
        "Table": $.pivotUtilities.renderers["Table"],
        "Collumn table": $.pivotUtilities.renderers["Table Barchart"],
        "Heat map": $.pivotUtilities.renderers["Heatmap"],
        "Heat table by line": $.pivotUtilities.renderers["Row Heatmap"],
        "Heat table by collumn": $.pivotUtilities.renderers["Col Heatmap"]
      }
    };
    if (c3r) {
      $.pivotUtilities.c3_renderers = {
        "Table": $.pivotUtilities.renderers["Table"],
        "Collumn table": $.pivotUtilities.renderers["Table Barchart"],
        "Heat map": $.pivotUtilities.renderers["Heatmap"],
        "Heat map by row": $.pivotUtilities.renderers["Row Heatmap"],
        "Heat map by collumn": $.pivotUtilities.renderers["Col Heatmap"],
        "Linear graph": c3r["Line Chart"],
        "Bar graph": c3r["Bar Chart"],
        "Stacked bar chart": c3r["Stacked Bar Chart"],
        "Area chart": c3r["Area Chart"],
        "Scatter plot": c3r["Scatter Chart"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.c3_renderers);
    }
    if (gcr) {
      $.pivotUtilities.locales.he.gchart_renderers = {
        "Linear graph": gcr["Line Chart"],
        "Bar graph": gcr["Bar Chart"],
        "Stacked bar graph": gcr["Stacked Bar Chart"],
        "Area graph": gcr["Area Chart"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.locales.he.gchart_renderers);
    }
    if (d3r) {
      $.pivotUtilities.locales.he.d3_renderers = {
        "Scatter plot": d3r["Treemap"]
      };
      $.pivotUtilities.locales.he.renderers = $.extend($.pivotUtilities.locales.he.renderers, $.pivotUtilities.locales.he.d3_renderers);
    }

    return $.pivotUtilities.locales.he;
  });

}).call(this);

//# sourceMappingURL=‏‏pivot.he.js.map
