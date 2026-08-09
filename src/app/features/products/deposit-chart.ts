/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  formatDateToFineract,
  FINERACT_DATE_FORMAT,
  FINERACT_LOCALE,
} from '../../core/utils/date-formatter';

/**
 * The interest rate chart a fixed or recurring deposit product carries.
 *
 * `charts` is mandatory on create *and* on update, which makes it the one part of these forms
 * that cannot simply be left out of an edit. A product's rates are the product, so the update
 * has to send back the chart it was given rather than a stand-in.
 */
export interface DepositChart {
  id?: number;
  fromDate: string;
  dateFormat: string;
  locale: string;
  chartSlabs: DepositChartSlab[];
}

export interface DepositChartSlab {
  id?: number;
  periodType: number;
  fromPeriod?: number;
  toPeriod?: number;
  annualInterestRate?: number;
  description?: string;
  locale: string;
}

/** Months, the unit the default chart is expressed in. */
const PERIOD_TYPE_MONTHS = 2;

/**
 * Turns the `activeChart` of a product response into something the update can send back.
 *
 * The ids are the point. A chart without them reads as a brand new one, and the platform answers
 * `500 Internal Server Error` rather than a validation message — which is what made editing a
 * fixed deposit product impossible. Carried back with its ids, the same chart is a no-op.
 */
export function chartFromResponse(activeChart: unknown): DepositChart | null {
  const chart = activeChart as
    | {
        id?: number;
        chartSlabs?: {
          id?: number;
          periodType?: { id?: number };
          fromPeriod?: number;
          toPeriod?: number;
          annualInterestRate?: number;
          description?: string;
        }[];
      }
    | undefined;
  if (!chart?.chartSlabs?.length) return null;

  return {
    id: chart.id,
    fromDate: formatDateToFineract(new Date()),
    dateFormat: FINERACT_DATE_FORMAT,
    locale: FINERACT_LOCALE,
    chartSlabs: chart.chartSlabs.map((slab) => ({
      id: slab.id,
      periodType: slab.periodType?.id ?? PERIOD_TYPE_MONTHS,
      fromPeriod: slab.fromPeriod,
      toPeriod: slab.toPeriod,
      annualInterestRate: slab.annualInterestRate,
      // The platform rejects a slab with no description on the way back in.
      description: slab.description || 'Interest rate',
      locale: FINERACT_LOCALE,
    })),
  };
}

/**
 * The chart a brand new product starts with.
 *
 * Still a placeholder — these forms have no rate-chart editor yet — but only ever used on create,
 * where inventing one is the difference between a product and a validation error. On update the
 * product's own chart is sent instead.
 */
export function defaultChart(): DepositChart {
  return {
    fromDate: formatDateToFineract(new Date()),
    dateFormat: FINERACT_DATE_FORMAT,
    locale: FINERACT_LOCALE,
    chartSlabs: [
      {
        periodType: PERIOD_TYPE_MONTHS,
        fromPeriod: 1,
        toPeriod: 60,
        annualInterestRate: 5,
        description: 'Interest rate',
        locale: FINERACT_LOCALE,
      },
    ],
  };
}
