/*
********************************************************************************
 * Copyright (c) 2014, 2017 Orange.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 ********************************************************************************

ModuleClass : BioElectricalImpedanceAnalysisAnnc

ModuleClass provides the analysis of human body tissue based on  impedance measurement.

Created: 2018-06-11 12:14:17
*/

package org.eclipse.om2m.commons.resource.flexcontainerspec;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import org.eclipse.om2m.commons.resource.AbstractFlexContainer;
import org.eclipse.om2m.commons.resource.AbstractFlexContainerAnnc;


@XmlRootElement(name = BioElectricalImpedanceAnalysisFlexContainerAnnc.SHORT_NAME, namespace = "http://www.onem2m.org/xml/protocols/homedomain")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = BioElectricalImpedanceAnalysisFlexContainerAnnc.SHORT_NAME, namespace = "http://www.onem2m.org/xml/protocols/homedomain")
public class BioElectricalImpedanceAnalysisFlexContainerAnnc extends AbstractFlexContainerAnnc {
	
	public static final String LONG_NAME = "bioElectricalImpedanceAnalysisAnnc";
	public static final String SHORT_NAME = "bEIAsAnnc";
	
	public BioElectricalImpedanceAnalysisFlexContainerAnnc () {
		setContainerDefinition("org.onem2m.home.moduleclass." + BioElectricalImpedanceAnalysisFlexContainer.LONG_NAME);
		setLongName(LONG_NAME);
		setShortName(SHORT_NAME);
	}
	
	public void finalizeSerialization() {
	}
	
	public void finalizeDeserialization() {
	}
	
}